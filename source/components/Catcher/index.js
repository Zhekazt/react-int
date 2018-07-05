//Core
import React, { Component } from "react";
import { object } from "prop-types";

//Instruments
import Styles from "./styles.m.css";

export default class Catcher extends Component {
    static propTypes = {
        children: object.isRequired,
    };

    state = {
        error: false,
    };

    componentDidCatch () {
        this.setState({
            error: true,
        });
    }

    render () {
        const { error } = this.state;
        const { children } = this.props;

        if (error) {
            return (
                <section className = { Styles.catcher }>
                    <h1>ARRRRRRRRRRRRR !!!!  You founded me!</h1>
                    <p>
                        Something went wrong we are working on getting this fixed
                    </p>
                </section>
            );
        }

        return children;
    }
}
