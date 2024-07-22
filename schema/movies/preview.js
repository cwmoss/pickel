export default {
  crewMember: (obj) => {
    return {
      title: obj.person.title,
      subtitle: `${obj.job} / ${obj.department}`,
      media: obj.person.media,
    };
  },
};
