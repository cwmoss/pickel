import {js} from "./util.js";

let x = "hello";
const previews = {
defaultImage:()=>({
   title: caption,
}),
castMember:()=>({
   title: characterName,
   subtitle: person.title,
   media: person.media,
}),
crewMember:()=>({
   title: person.title,
   subtitle: js`${job} - ${department}`,
   media: person.media,
}),
balance:()=>({
   title: "",
}),
movie:()=>({
   title: title,
   media: poster,
}),
person:()=>({
   title: name,
   media: image,
}),
screening:()=>({
   title: title,
}),
};

const data = `{"image_types":["defaultImage"],"object_types":["castMember","crewMember","balance"],"document_types":["movie","person","screening"],"reference_types":[],"types":[{"name":"defaultImage","type":"image","title":"defaultImage","description":null,"preview":{"title":"caption"},"fields":[{"type":"string","title":"caption","name":"caption","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"reference","title":"asset","name":"asset","description":null,"hidden":false,"readOnly":false,"component":null,"to":[{"type":"sh.asset"}],"of":null,"opts":[]}]},{"name":"castMember","type":"object","title":"castMember","description":null,"preview":{"title":"characterName","subtitle":"person.title","media":"person.media"},"fields":[{"type":"string","title":"characterName","name":"characterName","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"reference","title":"person","name":"person","description":null,"hidden":false,"readOnly":false,"component":null,"to":[{"type":"person"}],"of":null,"opts":[]},{"type":"number","title":"externalId","name":"externalId","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"string","title":"externalCreditId","name":"externalCreditId","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]}]},{"name":"crewMember","type":"object","title":"crewMember","description":null,"preview":{"title":"person.title","subtitle":"js`${job} - ${department}`","media":"person.media"},"fields":[{"type":"string","title":"department","name":"department","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"string","title":"job","name":"job","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"reference","title":"person","name":"person","description":null,"hidden":false,"readOnly":false,"component":null,"to":[{"type":"person"}],"of":null,"opts":[]},{"type":"number","title":"externalId","name":"externalId","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"string","title":"externalCreditId","name":"externalCreditId","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]}]},{"name":"balance","type":"object","title":"balance","description":null,"preview":{"title":null},"fields":[{"type":"number","title":"costs","name":"costs","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"number","title":"revenue","name":"revenue","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]}]},{"name":"movie","type":"document","title":"movie","description":null,"preview":{"title":"title","media":"poster"},"fields":[{"type":"string","title":"title","name":"title","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"slug","title":"slug","name":"slug","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"text","title":"overview","name":"overview","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"datetime","title":"releaseDate","name":"releaseDate","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"number","title":"externalId","name":"externalId","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"number","title":"popularity","name":"popularity","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"defaultImage","title":"poster","name":"poster","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"array","title":"castMembers","name":"castMembers","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":[{"type":"castMember"}],"opts":[]},{"type":"array","title":"crewMembers","name":"crewMembers","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":[{"type":"crewMember"}],"opts":[]},{"type":"balance","title":"balance","name":"balance","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]}]},{"name":"person","type":"document","title":"person","description":null,"preview":{"title":"name","media":"image"},"fields":[{"type":"string","title":"name","name":"name","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"slug","title":"slug","name":"slug","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"defaultImage","title":"image","name":"image","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]}]},{"name":"screening","type":"document","title":"screening","description":null,"preview":{"title":"title"},"fields":[{"type":"string","title":"title","name":"title","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"reference","title":"movie","name":"movie","description":null,"hidden":false,"readOnly":false,"component":null,"to":[{"type":"movie"}],"of":null,"opts":[]},{"type":"boolean","title":"published","name":"published","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"geopoint","title":"location","name":"location","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"datetime","title":"beginAt","name":"beginAt","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"datetime","title":"endsAt","name":"endsAt","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"string","title":"allowedGuests","name":"allowedGuests","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[],"list":["members","friends","anyone"],"layout":["radio"],"direction":"vertical"},{"type":"url","title":"infoUrl","name":"infoUrl","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]},{"type":"file","title":"ticket","name":"ticket","description":null,"hidden":false,"readOnly":false,"component":null,"to":null,"of":null,"opts":[]}]}],"refs":{"DefaultImage":{"asset":0},"CastMember":{"person":0},"CrewMember":{"person":0},"Screening":{"movie":0}}}`;

export default {
data: JSON.parse(data),
previews,
};