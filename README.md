# Nutrient Management Plugin for Cowork

A Claude Cowork plugin providing evidence-based UK agricultural nutrient management recommendations based on the **AHDB RB209 Nutrient Management Guide**.

## Overview

This plugin converts the [nutrient-management-skill](https://github.com/charles-gentry/nutrient-management-skill) into a Cowork plugin. It provides fertiliser planning guidance for all major UK crop sectors, helping farmers and agronomists make evidence-based nutrient decisions.

## What This Plugin Does

- Recommends nitrogen, phosphate, potash, magnesium, sulphur, and micronutrient rates by crop
- Guides Soil Nitrogen Supply (SNS) assessment using the Field Assessment and Measurement methods
- Classifies soil P, K, and Mg indices and explains maintenance vs build-up strategies
- Provides pH and liming guidance for all crop sectors
- Covers England and Wales agricultural conditions (Scotland and Northern Ireland have separate guidance)

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

## Important Limitations

- Recommendations assume good soil structure, adequate water supply, and effective pest/disease control
- Organic material nutrient contributions (RB209 Section 2) must be deducted from fertiliser recommendations
- NVZ and Farming Rules for Water regulations may impose additional constraints
- Soil sampling should be carried out every 3–5 years
- Professional agronomic advice should complement these guidelines

## Source

Based on the AHDB RB209 Nutrient Management Guide — the authoritative reference for agricultural nutrient planning in England and Wales.
