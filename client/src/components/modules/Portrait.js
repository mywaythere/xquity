import React, { useState }  from "react";
import "./Portrait.css";
import "./NewPostInput.css";
import { post } from "../../utilities";
/**
 * Component that renders cat happiness
 *
 * Proptypes
 * @param {Object} portrait
 */
const Portrait = (props) => {
  const body = { age: props.portrait.age, gender: props.portrait.gender, occupation: props.portrait.occupation};
  function handleChangeAge(event) {
    // updated props.portrait reference instead of using body variable.
    // I don't think that the body variable is actually required.
    props.portrait.age = event.target.value;
  }
  const handleSubmitAge = (event) => {
    event.preventDefault();
    // here i just use the props.portrait reference to send the post request.
    post("/api/age", {age: props.portrait.age} );
  };

  function handleChangeGender(event) {
    // TODO: update props.portrait.gender with value in event.target.gender
    console.log(event.target.gender);
  }
  const handleSubmitGender = (event) => {
    event.preventDefault();
    // TODO: update to send JSON object referencing from props
    post("/api/gender", body.gender);
  };

  function handleChangeOccupation(event) {
    // TODO: update props.portrait.occupation with value in event.target.occupation
    console.log(event.target.occupation);
  }
  const handleSubmitOccupation = (event) => {
    event.preventDefault();
    // TODO: update to send JSON object referencing from props
    post("/api/occupation", body.occupation);
  };
  return (
    <div className="Portrait-container">
      <div className="Portrait-story">
        <p className="Portrait-storyContent">
          Age:<input value={props.portrait.age} onChange={handleChangeAge} className="NewPostInput-input" />
          <button type="button" className="NewPostInput-button u-pointer" onClick={handleSubmitAge}>Edit</button>
        </p>
        <p className="Portrait-storyContent">
          Gender:<input value={props.portrait.gender} onChange={handleChangeGender} className="NewPostInput-input" />
          <button type="submit" className="NewPostInput-button u-pointer" onClick={handleSubmitGender}>Edit</button>
        </p>
        <p className="Portrait-storyContent">
          Occupation:<input value={props.portrait.occupation} onChange={handleChangeOccupation} className="NewPostInput-input" />
          <button type="submit" className="NewPostInput-button u-pointer" onClick={handleSubmitOccupation}>Edit</button>
        </p>
      </div>
    </div>
  );
};

export default Portrait;
