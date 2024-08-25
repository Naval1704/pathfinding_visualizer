import React from 'react';
import { Component } from 'react';
import './styles/grid.css';

export default class Node extends Component{
    constructor(props){
        super(props) ;
        this.state = {} ;
    }

    render() {
        return <div className='node'></div> ;
    }
}