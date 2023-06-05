import React, { useState } from "react";
import "./profile.css";
import NavBarStores from "../../components/NavBarStores/NavBarStores";
import { UpLoad } from "../../components/Icons/Icons";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import AWS from "aws-sdk";
import RandomText from "../../components/TextAlerts/TextAlerts";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const name = user.name;
  const mail = user.mail;
  const photo = user.photo;
  const lastname = user.lastname;
  const [selectedFile, setSelectedFile] = useState(null);
  const [reload, setReload] = useState(false);

  const [data, setData] = useState({
    name: user.name,
    last_name: user.lastname,
    photo: user.photo,
    email: user.mail,
  });

  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    region: "sa-east-1",
  });

  async function editProfile(e) {
    const token = localStorage.getItem("token");
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    const url = "http://localhost:8080/auth/update";
    try {
      let photoStorage = user.photo;
      if (selectedFile) {
        const file = selectedFile;
        const fileName = `${file.name}`;
        const params = {
          Bucket: "lanceapp",
          Key: fileName,
          Body: file,
        };
        const responseS3 = await s3.upload(params).promise();
        photoStorage = responseS3.Location;
      }

      const response = await axios.put(
        url,
        {
          ...data,
          photo: photoStorage,
        },
        headers
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          name: data.name,
          lastname: data.last_name,
          photo: photoStorage,
        })
      );
      setReload(true);
      toast.success(response.data.message);
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Network Error");
      } else {
        if (typeof error.response.data.message === "string") {
          toast.error(error.response.data.message);
        } else {
          error.response.data.message.forEach((err) => toast.error(err));
        }
      }
    }
  }

  function handleFileSelect(event) {
    setSelectedFile(event.target.files[0]);
  }

  return (
    <>
      <NavBarStores />
      <div className="containerContent">
        <div className="backgroundProfile">
          <div className="topProfile">Welcome back {name} !</div>
          <div className="bottomProfile">
            <span className="iconInfo">
              <p>i</p>
            </span>
            <p>
              <RandomText />
            </p>
          </div>
          <span className="containerImageRounded">
            <img src={photo} alt="" className="profileImageRounded" />
            <div className="container-input">
              <input
                type="file"
                name="file-3"
                id="file-3"
                accept="image/png image/jpg image/jpeg image/bmp image/gif"
                className="inputfile inputfile-3"
                data-multiple-caption="{count} archivos seleccionados"
                multiple
                onChange={handleFileSelect}
                hidden
              />
              <label htmlFor="file-3" className="upLoadIcon">
                <UpLoad />
              </label>
            </div>
          </span>
          <div className="containerInputs">
            <span className="inputContainerProfile">
              <label>Name</label>
              <input
                type="text"
                value={data.name}
                onChange={(event) =>
                  setData({ ...data, name: event.target.value })
                }
              />
            </span>
            <span className="inputContainerProfile">
              <label>Last name</label>
              <input
                type="text"
                value={data.last_name}
                onChange={(event) =>
                  setData({ ...data, last_name: event.target.value })
                }
              />
            </span>
            <span className="inputContainerProfileEmail">
              <label>Email</label>
              <input
                type="text"
                placeholder={mail}
                className="mailDisabled"
                onChange={(event) =>
                  setData({ ...data, email: event.target.value })
                }
                disabled
              />
            </span>

            <span className="containerButtonsProfile">
              <div className="buttonProfile" onClick={editProfile}>
                Save
              </div>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
