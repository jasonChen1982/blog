---
title: markdown for GitHub Flavored Markdown
date: 2015-02-11
---

# SOME ABOUT GitHub Flavored Markdown


## Dividing line

`***` `---` `___` can display as boldface line 

***

---

___


## Multilevel Title

# `#` h1

## `##` h2

### `###` h3

#### `####` h4

##### `#####` h5

###### `######` h6


## Text Area

##### Normal Text

so ordinary text content

##### Single Line Text

​    before the line with `tab` or `4 space`

##### Text block

```
use ``` at the text block before and after
```

#### Inline Tag

`opengl es` `WebGL` `canvas` `some` `i` `love`


## Word Break

add `2 space` at pre-line

or

insert a empty line at before and after

### Italic Bold Delete

| syntax                | preview           |
| --------------------- | ----------------- |
| `*Italic*` `_Italic_` | *Italic* _Italic_ |
| `**Bold**` `__Bold__` | **Bold** __Bold__ |
| `~~Delete~~`          | ~~Delete~~        |

text effect can add-on with each other


## Inline Link & Inludes Image

#### Inline Link

syntax

```
![alt](URL Title)
```

talk about `alt` `URL` `Title`

- `alt` show at load image fail
- `URL` image link accept `identifier url` `relative path` `link`
- `title` show when mouse hover

| syntax                                   | preview                                  |
| ---------------------------------------- | ---------------------------------------- |
| `[my site](http://www.jason82.com "jasonchen blog")` | [my site](http://www.jason82.com jasonchen blog) |
| `[my site][blog]`                        | [my site][blog]                          |

`[blog]:https://github.com/jasonChen1982/blog "github blog"`

#### Same Repertory Link

| syntax                                   | preview                                  |
| ---------------------------------------- | ---------------------------------------- |
| `[paper](/papers)`                       | [paper](/papers)                         |
| `[file](/papers/2015-02-11-markdown for github.md)` | [file](/papers/2015-02-11-markdown for github.md) |



#### Includes Image

| syntax                                   | preview                                  |
| ---------------------------------------- | ---------------------------------------- |
| `[![my-site]](http://jason82.com/)`      | [![my-site]](http://jason82.com/)        |
| `[![](http://jason82.com/static/imgs/contect2.png "")][blog]` | [![](http://jason82.com/static/imgs/contect2.png "")][blog] |
| `[![blog-logo]][blog]`                   | [![blog-logo]][blog]                     |



##  Anchor

| syntax                           | preview                        |
| -------------------------------- | ------------------------------ |
| `[Back To Top](##dividing line)` | [Back To Top](##dividing line) |



## List Style

#### Unordered List

* xxx: yyyy
* xxx: yyyy

#### Order List

1. xxx
2. yyy
3. zzz

#### Multilevel Unordered List

* xxx
  * yyy
    * xxx

#### Multilevel Ordered List

1. xxx
   1. yyy
      1. zzz

#### CheckBox

- [x] learn
- [x] do
- [x] hard
- [ ] plan

## Quotes

`>xxxx`

> xxx
>
> this is yyy

`>>xxxx`

> > xxx
> >
> > this is depth yyy



## Highlight

```javascript
const point = new Point2D(0, 10);
const vector ＝ new Vector3D(1, 0, 0);
vector.normalize();
```



## Emoji

`:blush:` ​:blush:​

## Details

<details>
<summary>Some Details Here</summary>
can`t support markdown
</details>

## Others
now `GFM` support html layout tags and simple css style, just like following:
```html
<div align="center">
  <a href="https://github.com/jcc2d">
    <img width="200" heigth="200" src="https://github.com/jcc2d/logo.svg">
  </a>
  <br>
  <h1>jcc2d</h1>
  <p>
    jcc2d is A lightweight canvas 2d renderer & An build-in awesome animator.
  <p>
</div>
``` 


[blog]:https://github.com/jasonChen1982/blog "github blog"
[zhihu]:https://www.zhihu.com/people/jasonchen1982 "zhihu"
[blog-logo]:http://jason82.com/static/imgs/contect2.png "zhihu"
[logo]:https://www.zhihu.com/people/jasonchen1982 "zhihu"