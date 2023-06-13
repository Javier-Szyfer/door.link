import groq from "groq";
import { publicClient } from "../client/sanity";
export const getMixtapeByNumber = async (mixtapeNumber: string) => {
  const query = groq`*[number=="${mixtapeNumber}"]{
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
  }`;

  return publicClient
    .fetch(query)
    .then((res) => {
      return res;
    })
    .catch((err) => console.error("Error occurred: ", err));
};
