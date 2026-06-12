export default {
  name: 'event',
  title: 'Event',
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
    { name: 'date', title: 'Date', type: 'date' },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    {
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: ['Hackathon', 'Conference', 'Meetup', 'Workshop', 'Other'],
      },
    },
    { name: 'myRole', title: 'My Role', type: 'string' },
    { name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } },
    {
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    { name: 'teamMembers', title: 'Team Members', type: 'text' },
    { name: 'award', title: 'Award', type: 'string' },
    { name: 'certificateImage', title: 'Certificate Image', type: 'image' },
  ],
}
