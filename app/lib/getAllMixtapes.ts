import groq from "groq";
import { publicClient } from "../client/sanity";

export const getAllMixtapes = async () => {
  const query = groq`*[_type == "mixtape"]{
    _createdAt,
    _id,
    _rev,
    _type,
    _updatedAt,
    "artwork": artwork.asset->,
    "audio": audio.asset->,
    date,
    description,
    duration,
    number,
    title
  } | order(number desc)`;

  return publicClient
    .fetch(query)
    .then((res) => {
      return res;
    })
    .catch((err) => console.error("Error occurred: ", err));
};
