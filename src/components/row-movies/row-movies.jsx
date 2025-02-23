import  { memo, useEffect, useState } from 'react'
import { Modal } from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import MovieService from '../../services/movie-service'
import Error from '../error/error'
import MovieInfo from '../movie-info/movie-info'
import RowMoviesItem from '../row-movies-item/row-movies-item'
import Spinner from '../spinner/spinner'
import "./row-movies.scss"

function arePropsEqual(prevProps, nextProps){
	return prevProps.page === nextProps.page
}

const RowMovies = memo(function RowMoives(props) {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [open, setOpen] = useState(false)
	const [movies, setMovies] = useState([])
	const [movieId, setMovieId] = useState(null)
	const [page, setPage] = useState(1)
	const [newItemLoading, setNewItemLoading] = useState(false)
	const [isFetching, setIsFetching] = useState(false) // Qayta so'rov jo'natilishini oldini olish uchun

	const movieService = new MovieService()

	useEffect(() => {
			// Faqat bir marta sahifa yuklanganda ishlaydi
			getTrendingMovies(page)
	}, [])

	const onClose = () => setOpen(false)

	const onOpen = (id) => {
			setOpen(true)
			setMovieId(id)
	}

	const getTrendingMovies = async (currentPage) => {
			try {
					setLoading(true)
					const res = await movieService.getTrandingMovies(currentPage)
					setMovies(res)
			} catch  {
					setError(true)
			} finally {
					setLoading(false)
			}
	}

	const getMoreMovies = async () => {
			// Agar allaqachon yuklanayotgan bo'lsa, qayta so'rov jo'natilmasin
			if (isFetching) return

			setIsFetching(true)  // So'rov ketayotganini belgilang
			setNewItemLoading(true)

			try {
					const nextPage = page + 1 // Keyingi sahifani olamiz
					const res = await movieService.getTrandingMovies(nextPage)

					// Yangi kelgan filmlarni filterlab qo'shamiz
					const newMovies = res.filter(newMovie =>
							!movies.some(oldMovie => oldMovie.id === newMovie.id)
					)
					setMovies(prevMovies => [...prevMovies, ...newMovies])
					setPage(nextPage) // Sahifani oshiramiz
			} catch {
					setError(true)
			} finally {
					setNewItemLoading(false)
					setIsFetching(false) // So'rov tugagach belgini o'chiramiz
			}
	}

	const errorContent = error ? <Error /> : null
	const loadingContent = loading ? <Spinner /> : null

	return (
			<div className='rowmovies'>
					<div className='rowmovies__top'>
							<div className='rowmovies__top-title'>
									<img src='/tranding.svg' alt='' />
									<h1>Trending</h1>
							</div>
							<div className='hr' />
							<a href="#">See more</a>
					</div>
					{errorContent}
					{loadingContent}
					<Content movies={movies} onOpen={onOpen} />

					<div className='rowmovies__loadmore'>
							<button 
									className='btn btn-secondary' 
									onClick={getMoreMovies}
									disabled={newItemLoading} 
							>
									{newItemLoading ? 'Loading...' : 'Load More'}
							</button>
					</div>

					<Modal open={open} onClose={onClose}>
							<MovieInfo movieId={movieId} />
					</Modal>
			</div>
	)
}, arePropsEqual)


export default RowMovies

const Content = ({movies, onOpen}) => {
	return (
		<div className='rowmovies__lists'>
			{movies.map((movie) => (
				<RowMoviesItem 
					key={movie.id} 
					movie={movie} 
					onOpen={onOpen}
				/>
			))}
		</div>
	)
} 