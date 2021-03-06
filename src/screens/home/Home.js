import React, { Component } from './node_modules/react';
import { LoggedInHeader } from '../../components';

import Grid from './node_modules/@material-ui/core';
import withStyles from './node_modules/@material-ui/core';
import Container from './node_modules/@material-ui/core';
import Card from './node_modules/@material-ui/core/Card';
import CardHeader from './node_modules/@material-ui/core/CardHeader';
import CardMedia from './node_modules/@material-ui/core/CardMedia';
import CardContent from './node_modules/@material-ui/core/CardContent';
import CardActions from './node_modules/@material-ui/core/CardActions';
import Avatar from './node_modules/@material-ui/core/Avatar';
import IconButton from './node_modules/@material-ui/core/IconButton';
import Typography from './node_modules/@material-ui/core/Typography';
import FavoriteIcon from './node_modules/@material-ui/icons/Favorite';
import FavoriteBorderIcon from './node_modules/@material-ui/icons/FavoriteBorder';  
import FormControl from './node_modules/@material-ui/core';
import InputLabel from './node_modules/@material-ui/core';
import Input from './node_modules/@material-ui/core';
import FormHelperText from './node_modules/@material-ui/core';
import Button from './node_modules/@material-ui/core';

const useStyles = theme => ({
	root: {
		marginTop: '2rem'
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	},
	media: {
		height: 0,
		paddingTop: '56.25%', 
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
	hashtag: {
		color: 'skyblue'
	},
	fillColor: {
		color: 'red'
	},
	addComment: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	addCommentFormControl: {
		flexGrow: 1,
		display: 'flex',
		marginRight: '16px'
	},
	mb16: {
		marginBottom: '16px'
	}
});


class Home extends Component {

	constructor() {
		super();
		this.state = {
			Images: [],
			commentRequired: "dispNone",
			comment: '',
			comments: [],
			UserId: '',
			Profile: null
		};
	}
	componentWillMount() {
		this.loadImages();
	}

	loadImages = async () => {
		let data = await getMedia();
		this.setState({ Images: data, Profile: data[0].user })
	}

	addFavorite = (id) => {
		let items = update(this.state.Media, id);
		this.setState({
			Images: items
		});
	}

	onChangeHandler = (e, id) => {
		let comment = e.target.value;
		this.setState({
			comment: comment,
			UserId: id
		});

	}

	onSearchHandler = (e) => {
		let searchText = e.target.value
		let filterMatchedItems = this.state.Images.filter((item) => {
			return item.caption.text.indexOf(searchText) !== -1;
		});
		this.setState({
			Images: filterMatchedItems
		});
		if (searchText === '') {
			this.Images();
		}
	}

	addCommentHandler = (id) => {
		let { comment } = this.state;
		if (comment.trim() === '') {
			return;
		}
		let items = addComments(this.state.Images, id, comment);
		this.setState({
			comment: "",
			Images: items
		});
	}

	render() {
		const { classes, history } = this.props;
		let { commentRequired, , userProfile, Images } = this.state;
		let profile_picture = null;
		if (userProfile) {
			profile_picture = userProfile.profile_picture
		}

		if (!profile_picture) {
			return <div>Loading....</div>
		}
		return (
			<div>
				
				<Container className={classes.root}>
					<Grid container spacing={2} >

						{
							Images.map(((user, index) => {
								let text = user.caption.text.split("#");
								let caption = text[0];
								let hashtags = text.splice(1);
								let { comments, user: { username, profile_picture } } = user;

								return (<Grid item xs={12} sm={6} key={user.id}>
									<Card className={classes.root}>
										<CardHeader
											avatar={
												<Avatar aria-label="recipe" className={classes.avatar}>
													<img src={profile_picture} alt="profile" />
												</Avatar>
											}
											title={username}
		
										/>

										<CardContent>
											<CardMedia
												className={classes.media}
												image={user.images.standard_resolution.url}
												title="Paella dish"
											/>
											<Typography variant="body2" component="p">
												{caption}
											</Typography>
											{
												hashtags.map((value) => {
													return (<Typography key={"hashtag" + value} variant="body2" component="span" className={classes.hashtag}>
														#{value}
													</Typography>)
												})
											}

										</CardContent>
										<CardActions disableSpacing>
											<IconButton aria-label="add to favorites" onClick={this.addFavorite.bind(this, user.id)}>
												{user.isFavorite ? <FavoriteIcon className={classes.fillColor} /> : <FavoriteBorderIcon />}
											</IconButton>
											<Typography variant="body2" component="p">
												{user.likes.count} likes
											</Typography>
											<br />
										</CardActions>
										<CardContent>
											{
												comments.values && comments.values.map((comment, index) => {
													return (<Typography variant="body2" component="p" key={comment + index + user.id} className={classes.mb16}>
														{username}: &nbsp; {comment}
													</Typography>)
												})
											}
											<br /><br />
											<Grid item xs={12} className={classes.addComment} justify-content="space-between">
												<FormControl className={classes.addCommentFormControl}>
													<InputLabel htmlFor="password"> Add a Comment </InputLabel>
													<Input type="text" onChange={(e) => this.onChangeHandler(e, user.id)} value={UserId === user.id ? this.state.comment : ''} />
													<FormHelperText className={commentRequired}><span className="red">required</span></FormHelperText>
												</FormControl>
												<Button variant="contained" color="primary" onClick={this.addCommentHandler.bind(this, user.id)} className={classes.login__btn}>Add</Button>
											</Grid>
										</CardContent>
									</Card>
								</Grid>)
							}))
						}
					</Grid>
				</Container>
			</div >
		)
	}

}

export default withStyles(useStyles)(Home);
