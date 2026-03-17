# Nutrient Management Plugin for Cowork

A Claude Cowork plugin providing evidence-based UK agricultural nutrient management recommendations based on the **AHDB RB209 Nutrient Management Guide**, with optional live calculations via the AHDB RB209 Web API.

## Overview

This plugin converts the [nutrient-management-skill](https://github.com/charles-gentry/nutrient-management-skill) into a Cowork plugin. It provides fertiliser planning guidance for all major UK crop sectors, helping farmers and agronomists make evidence-based nutrient decisions.

When RB209 API credentials are configured, Claude can call the live AHDB calculation engine rather than relying solely on static tables — giving authoritative, calculated outputs that account for the specific field, crop, soil analysis, and organic material inputs provided.

## What This Plugin Does

- Recommends nitrogen, phosphate, potash, magnesium, sulphur, and micronutrient rates by crop
- Guides Soil Nitrogen Supply (SNS) assessment using the Field Assessment and Measurement methods
- Classifies soil P, K, and Mg indices and explains maintenance vs build-up strategies
- Provides pH and liming guidance for all crop sectors
- Covers England and Wales agricultural conditions (Scotland and Northern Ireland have separate guidance)
- Calls the AHDB RB209 Web API for live, calculated recommendations (requires credentials — see below)

## Skills

| Skill | Description |
|---|---|
| **start** | Plugin orientation and getting started guide |
| **nutrient-principles** | Core principles: soil indices, SNS, pH, liming, conversion factors |
| **arable-crops** | Cereals, oilseeds, sugar beet, peas, beans |
| **grass-forage** | Silage, grazing, hay, grass establishment |
| **potatoes** | All variety groups, ware and seed potato |
| **vegetables** | Brassicas, roots, alliums, salads, legumes |
| **fruit-vines-hops** | Top fruit, soft fruit, strawberries, grapes, hops |

## RB209 API Integration

The plugin includes an MCP server (`rb209-mcp-server/`) that wraps the [AHDB RB209 Web API](https://rb209-api-v1.ahdb.org.uk). This allows Claude to submit field data and receive live nutrient recommendations directly from the authoritative AHDB calculation engine.

### Available API tools

| Tool | Description |
|---|---|
| `rb209_get_crop_groups` | List arable crop groups |
| `rb209_get_crop_types` | List crop types within a group |
| `rb209_get_soil_types` | List soil types |
| `rb209_get_previous_crops` | List previous crop options for SNS |
| `rb209_get_recommendations` | Submit field data, receive N/P/K/Mg/S recommendations |

### Obtaining API credentials

The RB209 API requires a licence from AHDB. To request access:

1. Visit [rb209-api-v1.ahdb.org.uk/Home/RequestAccess](https://rb209-api-v1.ahdb.org.uk/Home/RequestAccess)
2. Or email **nutrient.management@ahdb.org.uk** / call 024 7647 8784
3. You will receive a **Username** and a **Licence Key**

The API is licensed under the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

### Configuring credentials

Set the following environment variables before starting Claude Code (or add them to your shell profile):

```sh
export RB209_USERNAME=your_username
export RB209_LICENCE_KEY=your_licence_key
```

The `.mcp.json` in this plugin reads these values automatically. If they are not set the MCP server will refuse to start and Claude will fall back to the static recommendation tables in the skill files.

### Installing the MCP server dependencies

The MCP server is a Node.js package. After cloning the plugin, install its dependencies once:

```sh
cd rb209-mcp-server
npm install
```

> **Note:** `node_modules` is not committed to the repository. You must run `npm install` before the API tools will work. Node.js 18 or later is required.

## Installation & Distribution

Cowork plugins are distributed as Git repositories — no compression or bundling is required.

### Install via Cowork marketplace

If this plugin has been published to a Cowork marketplace, install it with:

```
/plugin install charles-gentry/nutrient-management-plugin
```

### Install from GitHub

Add this repository directly as a plugin source:

```
/plugin marketplace add charles-gentry/nutrient-management-plugin
```

### Install from a ZIP (Cowork web)

If you are using the Cowork web interface, you can upload this repository as a ZIP file (File → Export ZIP from GitHub, or `git archive`). The 50 MB size limit applies; `node_modules` should be excluded before zipping.

```sh
git archive --format=zip HEAD -o nutrient-management-plugin.zip
```

Then upload the ZIP through the Cowork plugin manager.

## Important Limitations

- Recommendations assume good soil structure, adequate water supply, and effective pest/disease control
- Organic material nutrient contributions (RB209 Section 2) must be deducted from fertiliser recommendations
- NVZ and Farming Rules for Water regulations may impose additional constraints
- Soil sampling should be carried out every 3–5 years
- Professional agronomic advice should complement these guidelines
- API recommendations apply to England and Wales; Scotland and Northern Ireland have separate guidance

## Source

Based on the AHDB RB209 Nutrient Management Guide — the authoritative reference for agricultural nutrient planning in England and Wales.
