// Core
import React, { PureComponent } from 'react';
import { string, bool, func } from 'prop-types';
import cx from 'classnames';

// Instruments
import Styles from './styles.m.css';

// Components
import Star from 'theme/assets/Star';
import Remove from 'theme/assets/Remove';
import Edit from 'theme/assets/Edit';
import Checkbox from 'theme/assets/Checkbox';

export default class Task extends PureComponent {

    static propTypes = {
        _removeTaskAsync: func.isRequired,
        _updateTaskAsync: func.isRequired,
        created:          string.isRequired,
        id:               string.isRequired,
        message:          string.isRequired,
        // completed:   bool,
        favorite:         bool,
        modified:         string,
    };

    static defaultProps = {
        id:        '',
        created:   '',
        modified:  '',
        completed: false,
        favorite:  false,
        message:   'Выполнить важную задачу',
    };

    state = {
        newMessage:    this.props.message,
        isTaskEditing: false,
    };

    taskInput = React.createRef();

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };

    _taskInputFocus = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this.taskInput.current.focus();
        }
    };

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask(this._getTaskShape({}));

            return null;

        }
        this._setTaskEditingState(!isTaskEditing);
    };

    _updateTaskMessageOnKeyDown = (e) => {
        const enterKey = e.key === "Enter";
        const escapeKey = e.key === "Escape";
        const { newMessage } = this.state;

        if (enterKey) {
            if (!newMessage) {
                return null;
            }

            this._updateTask(this._getTaskShape({ message: newMessage }));
        } else
        if (escapeKey) {
            this._cancelUpdatingTaskMessage();

            return null;
        }
    };

    _cancelUpdatingTaskMessage = () => {
        this._setTaskEditingState(false);
        this.setState({ newMessage: this.props.message });

    };


    _setTaskEditingState = (state) => {
        const { message } = this.props;

        if (!state) {
            this.setState({ newMessage: message });
        }
        this.setState({ isTaskEditing: state });
        this._taskInputFocus();
    };

    _updateNewTaskMessage = (e) => {
        const { value: newMessage } = e.target;

        this.setState({ newMessage });
    };


    _toggleTaskFavoriteState = () => {
        const task = this._getTaskShape({ favorite: !this.props.favorite });

        this._updateTask(task);
    };

    _toggleTaskCompletedState = () => {
        const task = this._getTaskShape({ completed: !this.props.completed });

        this._updateTask(task);
    };

    _updateTask = (task) => {
        this._setTaskEditingState(false);

        this.props._updateTaskAsync(task);

    };

    render () {
        const {
            completed,
            favorite,
        } = this.props;

        const { isTaskEditing, newMessage } = this.state;

        const taskStyle = cx({
            [Styles.task]:      true,
            [Styles.completed]: completed,
        });

        return (<li className = { taskStyle } >
            <div className = { Styles.content }>
                <Checkbox
                    inlineBlock
                    checked = { completed }
                    className = { Styles.toggleTaskCompletedState }
                    color1 = '#3B8EF3'
                    color2 = '#FFF'
                    onClick = { this._toggleTaskCompletedState }
                />
                <input
                    disabled = { !isTaskEditing }
                    maxLength = { 50 }
                    ref = { this.taskInput }
                    type = 'text'
                    value = { newMessage }
                    onChange = { this._updateNewTaskMessage }
                    onKeyDown = { this._updateTaskMessageOnKeyDown }
                />
            </div>
            <div className = { Styles.actions }>
                <Star
                    inlineBlock
                    checked = { favorite }
                    className = { Styles.toggleTaskFavoriteState }
                    color1 = '#3B8EF3'
                    color2 = '#000'
                    onClick = { this._toggleTaskFavoriteState }
                />
                <Edit
                    inlineBlock
                    checked = { false }
                    className = { Styles.updateTaskMessageOnClick }
                    color1 = '#3B8EF3'
                    color2 = '#000'
                    onClick = { this._updateTaskMessageOnClick }
                />
                <Remove
                    inlineBlock
                    className = { Styles.removeTask }
                    color1 = '#3B8EF3'
                    color2 = '#000'
                    height = { 17 }
                    width = { 17 }
                    onClick = { this._removeTask }
                />
            </div>
        </li>);
    }
}
