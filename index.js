/**
 * @author: Acidiney Dias <acidineydias@gmail.com>
 * @description: Get A three last posts from a public instagram account
 * @date 07/02/2020
 */

const axios = require('axios');
const app = require('express')();

let profileData = {};

// get profile data from instagram
async function _getProfileDataFromInstagram(id) {
  try {
    const { data } = await axios.get(`https://www.instagram.com/${id}/?__a=1`);
    profileData = data;
  } catch (e) {
    return e.message
  }
}

function getTitleFromPosts(instaPost) {
  const { edge_media_to_caption: post } = instaPost;
  // get the last edition from edge text node
  return (
    post.edges[post.edges.length - 1] &&
    post.edges[post.edges.length - 1].node.text
  );
}

app.get('/:id', async function (req, res) {
  const error = await _getProfileDataFromInstagram(req.params.id);
	if (error) res.end(error)
  //retrieve user from insta graphql
  const { user = {} } = profileData.graphql;
  // console.log(user)

  // retrieve timeline from user

  const { edge_owner_to_timeline_media: timeline } = user;

  // retrieve posts from user
  const { edges: posts } = timeline;

  // get the last three post
  const recentPosts = posts.slice(0, 3);

  const b = recentPosts.map((post) => {
    const { node } = post;

    // print on console text from posts
    return {
      text: getTitleFromPosts(node),
      thumb: node.display_url,
      isVideo: node.is_video,
      likes: node.edge_liked_by.count,
      comments: node.edge_media_to_comment.count,
    };
  });

  res.end(JSON.stringify(b));
});

app.listen(3000);
