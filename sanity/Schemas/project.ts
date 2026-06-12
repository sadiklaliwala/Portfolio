export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    { name: 'description', title: 'Short Description', type: 'text' },
    { name: 'fullDescription', title: 'Full Description', type: 'text' },
    { name: 'problem', title: 'Problem Statement', type: 'text' },
    { name: 'solution', title: 'Solution', type: 'text' },
    { name: 'outcome', title: 'Outcome', type: 'text' },
    { name: 'myRole', title: 'My Role', type: 'text' },
    { name: 'duration', title: 'Duration', type: 'string' },
    {
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          'Solo Project',
          'Team Project',
          'Freelance Project',
          'Open Source Contribution',
          'Helped Friend'
        ],
      },
    },
    { name: 'techStack', title: 'Tech Stack', type: 'array', of: [{ type: 'string' }] },
    { name: 'category', title: 'Category', type: 'string', options: { list: ['Frontend', 'Backend', 'Fullstack'] }},
    { name: 'liveUrl', title: 'Live URL', type: 'url' },
    { name: 'githubUrl', title: 'GitHub URL', type: 'url' },
    { name: 'image', title: 'Main Image', type: 'image', options: { hotspot: true } },
    {
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }]
    },
    { name: 'challenges', title: 'Challenges', type: 'text' },
    { name: 'improvements', title: 'Future Improvements', type: 'text' },
    { name: 'featured', title: 'Featured', type: 'boolean' },
  ]
}