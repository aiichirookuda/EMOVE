$(function () {
  // メインビジュアル動画
  $('#ytPlayer').YTPlayer();

  //second section
  const baseURL = 'https://api.themoviedb.org/3';
  const imageURL_w154 = 'https://image.tmdb.org/t/p/w154';
  const API_KEY = '643341107b4d4779f368db8268e68602';

  const requests = {
    Trending: `${baseURL}/trending/movie/week?api_key=${API_KEY}&language=ja`,
    TopRated: `${baseURL}/movie/top_rated?api_key=${API_KEY}&language=ja`,
  };

  // スライダー
  function slideStart(id, rtl) {
    $(id).slick({
      slidesToShow: 8,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 0,
      speed: 9000,
      arrows: false,
      cssEase: 'linear',
      pauseOnFocus: false,
      pauseOnHover: false,
      pauseOnDotsHover: false,
      rtl: rtl,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          },
        },
      ],
    });
  }

  // 人気作品
  $.when(
    axios.get(requests.Trending).then(function (response) {
      const movies = response.data.results;
      movies.map((movie) => {
        const thumbnailPath = movie.poster_path;

        $('#trending').append(
          `<li><img src=${imageURL_w154}${thumbnailPath} alt="サムネ" /></li>`
        );
      });
    })
  ).then(function () {
    slideStart('#trending', false);
  });

  // トップレート
  $.when(
    axios.get(requests.TopRated).then(function (response) {
      const movies = response.data.results;
      movies.map((movie) => {
        const thumbnailPath = movie.poster_path;

        $('#topRated').append(
          `<li><img src=${imageURL_w154}${thumbnailPath} alt="サムネ" /></li>`
        );
      });
    })
  ).then(function () {
    slideStart('#topRated', true);
  });
});
