import React from 'react';
import './Profile.css';
import Topbar from '../../components/Topbar/Topbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Timeline from '../../components/Timeline/Timeline';
import Rightbar from '../../components/Rightbar/Rightbar';

export default function Profile() {
  return (
    <>
			<Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img 
                src="./assets/post/3.jpeg" 
                alt="" 
                className="profileCoverImg" 
              />
              <img 
                src="./assets/person/1.jpeg" 
                alt="" 
                className="profileUserImg" 
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">Seike Kanata</h4>
              <span className="profileInfoDesc">会社員です。</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Timeline />
            <Rightbar profile />
          </div>
        </div>
      </div>
		</>
  )
}
