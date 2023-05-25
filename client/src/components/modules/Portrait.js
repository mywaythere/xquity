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
    console.log(event.target.value);
  }
  const handleSubmitAge = (event) => {
    event.preventDefault();
    post("/api/age", body.age);
  };
  function handleChangeGender(event) {
    console.log(event.target.gender);
  }
  const handleSubmitGender = (event) => {
    event.preventDefault();
    post("/api/gender", body.gender);
  };
  function handleChangeOccupation(event) {
    console.log(event.target.occupation);
  }
  const handleSubmitOccupation = (event) => {
    event.preventDefault();
    post("/api/occupation", body.occupation);
  };
  return (
    <div className="Portrait-container">
      <div className="Portrait-story">
        <p className="Portrait-storyContent">
          Age:<input value={props.portrait.age} onChange={handleChangeAge} className="NewPostInput-input" />
          <button type="submit" className="NewPostInput-button u-pointer" onClick={handleSubmitAge}>Edit</button>
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
