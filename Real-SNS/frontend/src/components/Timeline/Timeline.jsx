import React from 'react';
import Post from '../Post/Post';
import Share from '../Share/Share';
import './Timeline.css';
import {Posts} from '../../dummyData';

export default function Timeline() {
  return (
    <div className="timeline">
      <div className="timelineWrapper">
        <Share />
        {Posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
    </div>
  )
}
