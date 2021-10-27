$(function () {
  const baseURL = 'https://api.themoviedb.org/3';
  const imageURL_origin = 'https://image.tmdb.org/t/p/original';
  const imageURL_w154 = 'https://image.tmdb.org/t/p/w154';
  const API_KEY = '643341107b4d4779f368db8268e68602';

  const requests = [
    {
      type: trending,
      url: `${baseURL}/trending/movie/week?api_key=${API_KEY}&language=ja`,
    },
    {
      type: topRated,
      url: `${baseURL}/movie/top_rated?api_key=${API_KEY}&language=ja`,
    },
    {
      type: action,
      url: `${baseURL}/discover/movie?api_key=${API_KEY}&language=ja&with_genres=28`,
    },
    {
      type: animation,
      url: `${baseURL}/discover/movie?api_key=${API_KEY}&language=ja&with_genres=16`,
    },
    {
      type: comedy,
      url: `${baseURL}/discover/movie?api_key=${API_KEY}&language=ja&with_genres=35`,
    },
    {
      type: horror,
      url: `${baseURL}/discover/movie?api_key=${API_KEY}&language=ja&with_genres=27`,
    },
    {
      type: romance,
      url: `${baseURL}/discover/movie?api_key=${API_KEY}&language=ja&with_genres=10749`,
    },
  ];

  // メインビジュアルデータ取得
  axios.get(requests[0].url).then((response) => {
    const movies = response.data.results;
    const num = Math.floor(Math.random() * movies.length);
    const banner = movies[num];

    $('.mainVisual').css(
      'background',
      `linear-gradient(#2c2c2c00 70%, #2c2c2c), url(${imageURL_origin}${banner.backdrop_path}) no-repeat center center / cover`
    );

    // titleの文字数制限
    let title = banner.title;
    console.log(banner.title);
    const titleLength = title.length;
    console.log(title.length);
    if (titleLength > 15) {
      title = title.substring(0, 15) + '..';
    } else {
      title;
    }
    $('#title').text(title);

    // overviewの文字数制限
    let overview = banner.overview;
    console.log(banner.overview);
    const overviewLength = overview.length;
    if (overviewLength > 150) {
      overview = overview.substring(0, 150) + '..';
    } else {
      overview;
    }

    $('#overview').text(overview);
  });

  // 各カテゴリ作品データ取得
  requests.map((request) => {
    axios.get(request.url).then((response) => {
      const movies = response.data.results;

      // サムネ画像配置
      movies.map((movie) => {
        const thumbnailPath = movie.poster_path;
        $(`#${request.type.id} .thumbnail`).append(
          `<li><a href="#"><img src=${imageURL_w154}${thumbnailPath} alt=${movie.title} /></a></li>`
        );
      });

      // トレーラー動画取得
      $(`#${request.type.id} .thumbnail img`).click(function () {
        const index = $(this).parents('li').index();
        const id = movies[index].id;

        axios
          .get(`${baseURL}/movie/${id}/videos?api_key=${API_KEY}`)
          .then(function (response) {
            const video = response.data.results[0];

            // トレーラー動画表示
            $(`#${request.type.id} .video`)
              .html(
                `<iframe width="560" height="315" src="https://www.youtube.com/embed/${video.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><button type="button" class="slideUp">×</button>`
              )
              .slideDown();

            // トレーラー動画非表示
            $(`#${request.type.id} .slideUp`).click(function () {
              $(`#${request.type.id} .video`).slideUp().html('');
            });
          });

        return false;
      });
    });

    // 横スクロールボタンクリック時の処理
    $(`#${request.type.id} button`).click(function () {
      const left = $(`#${request.type.id}`).offset().left;
      const windowWidth = $(window).width();
      const amount = windowWidth - left;
      const scrollSpeed = 500;

      if ($(this).hasClass('next')) {
        $(`#${request.type.id} .thumbnail`).animate(
          {
            scrollLeft:
              $(`#${request.type.id} .thumbnail`).scrollLeft() + amount,
          },
          scrollSpeed
        );
      } else {
        $(`#${request.type.id} .thumbnail`).animate(
          {
            scrollLeft:
              $(`#${request.type.id} .thumbnail`).scrollLeft() - amount,
          },
          scrollSpeed
        );
      }
    });
  });

  // 横スクロールボタン表示切り替え
  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    return;
  } else {
    $('.container').hover(
      function () {
        const $firstEl = $('li:first-child', this);
        const $lastEl = $('li:last-child', this);
        const mr = 20;

        const leftMost = $firstEl.position().left;
        const rightMost = $lastEl.position().left + $lastEl.width() + mr;

        const width = $('.thumbnail', this).width();

        switch (true) {
          case leftMost == 0:
            $('.next', this).fadeIn();
            break;

          case leftMost != 0 && rightMost > width:
            $('.previous, .next', this).fadeIn();
            break;

          case rightMost <= width:
            $('.previous', this).fadeIn();
            break;
        }
      },
      function () {
        $('button', this).stop().fadeOut();
      }
    );

    $('.thumbnail').scroll(function () {
      const $firstEl = $('li:first-child', this);
      const $lastEl = $('li:last-child', this);
      const mr = 20;

      const leftMost = $firstEl.position().left;
      const rightMost = $lastEl.position().left + $lastEl.width() + mr;

      const width = $(this).width();

      switch (true) {
        case leftMost == 0:
          $('~ .previous', this).fadeOut();
          break;

        case leftMost != 0 && rightMost > width:
          $('~ .previous, ~ .next', this).fadeIn();
          break;

        case rightMost <= width:
          $('~ .next', this).fadeOut();
          break;
      }
    });
  }
});
