/**
 * @author: Acidiney Dias <acidineydias@gmail.com>
 * @description: Get A three last posts from a public instagram account
 * @date 07/02/2020
*/

'use strict'
const axios = require('axios')

const publicCredentials = {
	username: 'acidineydias',
}

let profileData = {}

// get profile data from instagram
async function _getProfileDataFromInstagram () {
	try {
		const { data } = await axios.get(`https://www.instagram.com/${publicCredentials.username}/?__a=1`)
		profileData = data
	} catch (e) {
		throw "Cannot comunicate with instagram \ " + e
	}
}

function getTitleFromPosts (instaPost) {
	const { edge_media_to_caption: post } = instaPost
	// get the last edition from edge text node
	return post.edges[post.edges.length - 1] && post.edges[post.edges.length - 1].node.text
}

;(async function () {
	await _getProfileDataFromInstagram()
	
	//retrieve user from insta graphql
	const { user = {} } = profileData.graphql
	// console.log(user)

	// retrieve timeline from user

	const { edge_owner_to_timeline_media: timeline } = user

	// retrieve posts from user
	const { edges: posts } = timeline

	// get the last three post
	const recentPosts = posts.slice(0, 3)

	recentPosts.forEach(post => {
		const { node } = post

		// print on console text from posts
		console.table({
			text: getTitleFromPosts(node),
			thumb: node.display_url,
			isVideo: node.is_video,
			likes: node.edge_liked_by.count,
			comments: node.edge_media_to_comment.count
		})
	})

})()