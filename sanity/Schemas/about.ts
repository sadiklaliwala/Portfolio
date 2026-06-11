export default {
  name: "about",
  title: "About",
  type: "document",
  fields: [
    { name: "bio", title: "Bio", type: "text" },
    { name: "location", title: "Location", type: "string" },
    { name: "email", title: "Email", type: "string" },
    { name: "github", title: "GitHub URL", type: "url" },
    { name: "linkedin", title: "LinkedIn URL", type: "url" },
    {
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "stats",
      title: "Stats",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "number", title: "Number", type: "string" },
            { name: "label", title: "Label", type: "string" },
          ],
        },
      ],
    },
  ],
};
