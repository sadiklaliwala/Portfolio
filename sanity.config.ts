import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/Schemas";
import { apiVersion, dataset, projectId } from "./sanity/env";

export default defineConfig({
  name: "default",
  title: "Portfolio CMS",

  projectId,
  dataset,

  basePath: "/studio",

  schema: {
    types: schemaTypes,
  },

  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
});
