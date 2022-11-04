import React from "react";
import "./SearchBar.css";

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      search: "",
    };
  }

  handleTermChange(event) {
    this.setState({ search: event.target.value });
  }

  search() {
    this.props.onSearch(this.state.search);
  }

  handleClick(event) {
    event.preventDefault();
    this.search();
  }

  render() {
    return (
      <form onSubmit={this.handleClick} className="SearchBar">
        <input
          placeholder="Enter A Song, Album, or Artist"
          onChange={this.handleTermChange}
        />
        <button className="SearchButton" onClick={this.handleClick}>
          SEARCH
        </button>
      </form>
    );
  }
}
