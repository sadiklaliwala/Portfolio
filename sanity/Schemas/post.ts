import { Rule } from "sanity";

const postSchema = {
  name: "post",
  title: "Blog Post / TIL",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
        },
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    },
  ],
};

export default postSchema;
