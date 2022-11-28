const path = require('path');

module.exports = {
	mode: 'development',
	output: {
		path: path.resolve(__dirname, "public"),
		filename: 'script.bundle.js',
		publicPath: '/',
	},
	devtool: 'inline-source-map',
	devServer: {
		static: './public',
		hot: true,
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	}
};