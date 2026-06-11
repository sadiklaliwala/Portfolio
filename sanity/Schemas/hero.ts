export default {
  name: 'hero',
  title: 'Hero',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'taglines', title: 'Taglines', type: 'array', of: [{ type: 'string' }] },
    { name: 'subtext', title: 'Subtext', type: 'string' },
    { name: 'resumeLink', title: 'Resume Link', type: 'url' },
  ]
}