export default {
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'icon', title: 'Icon Name', type: 'string' },
    { name: 'technologies', title: 'Technologies', type: 'array', of: [{ type: 'string' }] },
    { name: 'order', title: 'Order', type: 'number' },
  ]
}