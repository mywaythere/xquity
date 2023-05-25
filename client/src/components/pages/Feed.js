import React, { useState, useEffect } from "react";
import Card from "../modules/Card.js";
import { NewStory } from "../modules/NewPostInput.js";

import { get } from "../../utilities";

const Feed = (props) => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    document.title = "News Feed";
    get("/api/stories").then((storyObjs) => {
      let reversedStoryObjs = storyObjs.reverse();
      setStories(reversedStoryObjs);
    });
  }, []);

  const addNewStory = (storyObj) => {
    setStories([storyObj].concat(stories));
  };

  let storiesList = null;
  const hasStories = stories.length !== 0;
  if (hasStories) {
    storiesList = stories.map((storyObj) => (
      <Card
        key={`Card_${storyObj._id}`}
        _id={storyObj._id}
        creator_name={storyObj.creator_name}
        creator_id={storyObj.creator_id}
        userId={props.userId}
        content={storyObj.content}
      />
    ));
  } else {
    storiesList = <div>No posts!</div>;
  }
  return (
    <>
      {props.userId && <NewStory addNewStory={addNewStory} />}
      {storiesList}
    </>
  );
};

export default Feed;