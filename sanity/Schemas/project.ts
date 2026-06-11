export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'techStack', title: 'Tech Stack', type: 'array', of: [{ type: 'string' }] },
    { name: 'category', title: 'Category', type: 'string', options: { list: ['Frontend', 'Backend', 'Fullstack'] }},
    { name: 'liveUrl', title: 'Live URL', type: 'url' },
    { name: 'githubUrl', title: 'GitHub URL', type: 'url' },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
    { name: 'featured', title: 'Featured', type: 'boolean' },
  ]
}