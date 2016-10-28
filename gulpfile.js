var elixir = require('laravel-elixir');

elixir.config.sourcemaps = true;
elixir(function(mix) {
    mix.sass('./scss/app.scss', './css/app.min.css')
        .browserify('./scripts/app.js', './scripts/app.min.js');
});