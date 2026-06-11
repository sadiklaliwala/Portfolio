export default {
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    { name: 'company', title: 'Company', type: 'string' },
    { name: 'role', title: 'Role', type: 'string' },
    { name: 'startDate', title: 'Start Date', type: 'string' },
    { name: 'endDate', title: 'End Date', type: 'string' },
    { name: 'current', title: 'Currently Working Here', type: 'boolean' },
    { name: 'description', title: 'Description', type: 'array', of: [{ type: 'string' }] },
    { name: 'order', title: 'Order', type: 'number' },
  ]
}