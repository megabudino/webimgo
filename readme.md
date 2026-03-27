# WebIMGo

Batch image resizing and optimisation CLI tool.

This CLI tool helps you quickly resize and optimise images in batch within a directory.

It replaces the original images with optimised ones after an interactive confirmation step.


<br/>

---

## Prerequisites

You should have Nodejs v7.6 or greater running on your system. Install if you already haven't.

Use a <a href="https://docs.npmjs.com/downloading-and-installing-node-js-and-npm" target="_blank">Node Version Manager</a> to install Nodejs and NPM on your system. - (Recommended)

OR

You can use <a href="https://nodejs.org/" target="_blank">Nodejs installer</a>

---


## Installing

Installing this CLI tool simple and straightforward using NPM.
Install it as global.

```
sudo npm i webimgo -g
```
Enter system password if prompted

<br/>

If any permission issues on global install, you may try the below code

```
sudo npm i webimgo -g --unsafe-perm flag
```


<br/>

## Usage

By default, `webimgo` scans only the current directory. It does not enter subdirectories unless you explicitly pass `--recursive`.

Before any files are modified, the CLI always shows a confirmation prompt with the target directory, mode, file count, and a sample of matching files.

To optimise all images in the current folder, point your terminal to that folder and run:

```
 webimgo
 ```

To resize image width and optimise images in the current folder, pass `<width>`:

```
webimgo -w <width>
```

Replace `<width>` width with the amount of maximum width in pixels allowed.

### Safety options

Use `--recursive` to include subdirectories:

```
webimgo --recursive
```

Use `--force` only when you intentionally want to run from a high-risk directory such as `/`, `/Users`, `/home`, or your home directory:

```
webimgo --force
```

You can combine the options:

```
webimgo --recursive -w 1200
```

![Webimgo default coommand](./assets/webimgo-base.gif)

### Examples

To resize images to a maximum width of 1200 pixels in the current directory and compress them, use:
```
webimgo -w 1200
``` 
This resizes images wider than 1200 pixels and compresses all matching images in the current directory.

To do the same recursively across subdirectories:
```
webimgo --recursive -w 1200
```

![Webimgo width coommand](./assets/webimgo-width.gif)

<br/>

## Updating

To update this NPM package, run below command.

```
npm update -g webimgo
```

<br/>

---


#### Built Using

* [Nodejs](https://nodejs.org/) - Javascript runtime
* [Sharp](https://www.npmjs.com/package/sharp) - Used to resize images
* [imagemin](https://www.npmjs.com/package/imagemin) - Used to compress images
* [imagemin-mozjpeg](https://www.npmjs.com/package/imagemin-mozjpeg) - Used for compressing JPGs
* [imagemin-pngquant](https://www.npmjs.com/package/imagemin-pngquant) - Used for compressing PNGs
* [Yargs](https://www.npmjs.com/package/yargs) - Used as command line parser
* [image-size](https://www.npmjs.com/package/image-size) - Used for reading image dimensions
* [Chalk](https://www.npmjs.com/package/chalk) - stylising the terminal

#### Versioning

We use [GIT](https://git-scm.com/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

#### Authors

* **Sharun John** - [Github Profile](https://github.com/shaan07) - [Facebook](https://www.facebook.com/sharunjon) - [LinkdedIn](https://nz.linkedin.com/in/sharun-john)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

#### License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.

### Acknowledgments

* Hats off to all package developers and contributers for those amazing works.

