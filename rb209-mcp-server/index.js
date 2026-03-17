import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  getCropGroups,
  getCropTypes,
  getSoilTypes,
  getPreviousCrops,
  getRecommendations,
} from "./rb209Client.js";

const RB209_USERNAME = process.env.RB209_USERNAME;
const RB209_LICENCE_KEY = process.env.RB209_LICENCE_KEY;

if (!RB209_USERNAME || !RB209_LICENCE_KEY) {
  process.stderr.write(
    "Error: RB209_USERNAME and RB209_LICENCE_KEY environment variables are required.\n"
  );
  process.exit(1);
}

const server = new Server(
  { name: "rb209-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "rb209_get_crop_groups",
        description:
          "Returns all arable crop groups available in the AHDB RB209 API (e.g. Cereals, Oilseeds, Sugar Beet, Peas and Beans). Use this to discover valid CropGroupID values before calling rb209_get_crop_types or rb209_get_recommendations.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "rb209_get_crop_types",
        description:
          "Returns all crop types within a given arable crop group from the AHDB RB209 API. Use the CropGroupID from rb209_get_crop_groups. Returns CropTypeID values needed for nutrient recommendation requests.",
        inputSchema: {
          type: "object",
          properties: {
            cropGroupId: {
              type: "integer",
              description:
                "The ID of the crop group (obtained from rb209_get_crop_groups).",
            },
          },
          required: ["cropGroupId"],
        },
      },
      {
        name: "rb209_get_soil_types",
        description:
          "Returns all soil types available in the AHDB RB209 API. Use to discover valid SoilTypeID values for building a nutrient recommendation request.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "rb209_get_previous_crops",
        description:
          "Returns the list of previous crop options used for Soil Nitrogen Supply (SNS) assessment in the AHDB RB209 API. Use to discover valid previous crop IDs for building a nutrient recommendation request.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "rb209_get_recommendations",
        description:
          "Calls the AHDB RB209 API to calculate nutrient recommendations (N, P₂O₅, K₂O, MgO, SO₃) for a given field. Returns recommended nutrient rates, nutrients supplied by organic materials, and advice notes. Requires a complete field data object including crop, soil analysis, and optional organic material data. Build the fieldData using IDs from rb209_get_crop_groups, rb209_get_crop_types, and rb209_get_soil_types.",
        inputSchema: {
          type: "object",
          properties: {
            fieldData: {
              type: "object",
              description:
                "The complete field data object as required by the RB209 API POST /api/main/recommendations endpoint. Must include a Field object containing Soil (with SoilTypeID and SoilAnalyses), and either Arable crops or Grassland data depending on field type.",
              properties: {
                Field: {
                  type: "object",
                  properties: {
                    FieldType: {
                      type: "integer",
                      description: "1 = Arable, 2 = Grassland",
                    },
                    MultipleCrops: {
                      type: "boolean",
                      description: "Whether multiple crops are grown",
                    },
                    Arable: {
                      type: "array",
                      description: "Array of arable crop objects (if FieldType=1)",
                      items: {
                        type: "object",
                        properties: {
                          CropGroupID: { type: "integer" },
                          CropTypeID: { type: "integer" },
                          CropInfo1ID: { type: "integer" },
                          CropInfo2ID: { type: "integer" },
                          SowingDate: {
                            type: "string",
                            description: "ISO 8601 date-time string",
                          },
                          ExpectedYield: { type: "number" },
                        },
                      },
                    },
                    Grassland: {
                      type: "object",
                      description: "Grassland data object (if FieldType=2)",
                      properties: {
                        SNSID: { type: "integer" },
                        GrassGrowthClassID: { type: "integer" },
                        YieldTypeID: { type: "integer" },
                        SequenceID: { type: "integer" },
                        GrasslandSequence: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              Position: { type: "integer" },
                              CropMaterialID: { type: "integer" },
                              Yield: { type: "number" },
                            },
                          },
                        },
                        EstablishedDate: { type: "string" },
                        SeasonID: { type: "integer" },
                      },
                    },
                    Soil: {
                      type: "object",
                      properties: {
                        SoilTypeID: { type: "integer" },
                        KReleasingClay: { type: "boolean" },
                        NVZActionProgrammeID: { type: "integer" },
                        SoilAnalyses: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              SoilAnalysisDate: { type: "string" },
                              SoilpH: { type: "number" },
                              SulphurDeficient: { type: "boolean" },
                              SNSIndexID: { type: "integer" },
                              PIndexID: { type: "integer" },
                              KIndexID: { type: "integer" },
                              MgIndexID: { type: "integer" },
                              SNSMethodologyID: { type: "integer" },
                              PMethodologyID: { type: "integer" },
                              KMethodologyID: { type: "integer" },
                              MgMethodologyID: { type: "integer" },
                            },
                          },
                        },
                      },
                    },
                  },
                  required: ["FieldType", "Soil"],
                },
              },
              required: ["Field"],
            },
          },
          required: ["fieldData"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      case "rb209_get_crop_groups":
        result = await getCropGroups(RB209_USERNAME, RB209_LICENCE_KEY);
        break;

      case "rb209_get_crop_types":
        result = await getCropTypes(
          args.cropGroupId,
          RB209_USERNAME,
          RB209_LICENCE_KEY
        );
        break;

      case "rb209_get_soil_types":
        result = await getSoilTypes(RB209_USERNAME, RB209_LICENCE_KEY);
        break;

      case "rb209_get_previous_crops":
        result = await getPreviousCrops(RB209_USERNAME, RB209_LICENCE_KEY);
        break;

      case "rb209_get_recommendations":
        result = await getRecommendations(
          args.fieldData,
          RB209_USERNAME,
          RB209_LICENCE_KEY
        );
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
