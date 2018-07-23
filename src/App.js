import React, { Component } from "react";
import "./App.css";
import $ from "jquery";
// import marked from "marked";

const marked = window.marked;

marked.setOptions({
  breaks: true,
  gfm: true,
  pedantic: false
});

const renderer = new marked.Renderer();
const linkRenderer = renderer.link;
renderer.link = (href, title, text) => {
  const html = linkRenderer.call(renderer, href, title, text);
  return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
};
//const html = marked(markdown, { renderer });

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      previewText: ""
    };
    this.onChange = this.onChange.bind(this);
    this.clearText = this.clearText.bind(this);
  }
  componentDidMount = () => {
    const previewDefault = marked(defaultMkDwn, { renderer });

    this.setState({ text: defaultMkDwn, previewText: previewDefault });
  };

  onChange(e) {
    const markdown = marked(e.target.value, { renderer });
    this.setState({ text: e.target.value, previewText: markdown });

    autoExpand();
  }
  clearText() {
    console.log("clearText");
    this.setState({ text: "", previewText: "" });
  }

  render() {
    return (
      <div className="App">
        <Header />
        <div className="body">
          <Editor
            onChange={this.onChange}
            clearText={this.clearText}
            text={this.state.text}
          />
          <Preview previewText={this.state.previewText} />
        </div>
        <Footer />
      </div>
    );
  }
}

class Editor extends Component {
  render() {
    return (
      <div className="editSide">
        <div className="editorTop">
          <h1>Editor</h1>
          <button className="button" onClick={this.props.clearText}>
            Clear
          </button>
        </div>

        <textarea
          className="autoExpand"
          name="editor"
          id="editor"
          data-min-rows="5"
          rows="5"
          onChange={this.props.onChange}
          value={this.props.text}
        />
      </div>
    );
  }
}

class Preview extends Component {
  render() {
    const rawMarkup = this.props.previewText;
    function createMarkup() {
      return { __html: rawMarkup };
    }

    return (
      <div className="previewSide">
        <div className="previewTop">
          <h1>Preview</h1>
        </div>

        <div id="preview" dangerouslySetInnerHTML={createMarkup()} />
      </div>
    );
  }
}

class Header extends Component {
  render() {
    return (
      <div className="header">
        <h1>Markdown Code Previewer</h1>
        <p>
          Enter your Markdown code on the left and see how it will render on the
          right
        </p>
      </div>
    );
  }
}

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="authorLinks">
          <div className="socialLinks">
            <a href="https://github.com/REAOrlando">
              <i class="fab fa-github" />
            </a>
            <a href="https://www.linkedin.com/in/christopheralbanesefl/">
              <i class="fab fa-linkedin" />
            </a>
            <a href="https://twitter.com/albanesechris">
              <i class="fab fa-twitter" />
            </a>
          </div>

          <p>© Christopher Albanese 2018</p>
        </div>

        <div className="markdownJSLink">
          <h3>Powered by MarkedJS.org</h3>
          <a href="https://marked.js.org/#/README.md#README.md" target="_blank">
            <img src="https://marked.js.org/img/logo-black.svg" alt="" />
          </a>
        </div>
      </div>
    );
  }
}
const defaultMkDwn = `# This is what h1 looks like
## Here is a h2 sub-heading
[I'm a link to google ](www.google.com  target="_blank")
this is \`inline  code\`
 Here is code block
  \`\`\`javascript
  function codeBlock() {\n
  console.log("I'm a code block")\n
  }\`\`\`
Next is an image
![logo](https://source.unsplash.com/random/100x100)
1. I'm a list item 
1. So am I
2. Me too (the number doesn't matter) 
> I'm a Blockquote

**See how bold I can be!**
~~Sometimes we all make mistakes~~
`;
const autoExpand = () => {
  console.log("autoExpand called");
  $(document)
    .on("focus.autoExpand", "textarea.autoExpand", function() {
      var savedValue = this.value;
      this.value = "";
      this.baseScrollHeight = this.scrollHeight;
      this.value = savedValue;
    })
    .on("input.autoExpand", "textarea.autoExpand", function() {
      var minRows = this.getAttribute("data-min-rows") | 0,
        rows;
      this.rows = minRows;
      rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 16);
      this.rows = minRows + rows;
    });
};

export default App;
