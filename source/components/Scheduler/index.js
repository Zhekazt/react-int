// Core
import React, { Component } from 'react';
import FlipMove from 'react-flip-move';


// Instruments
import Styles from './styles.m.css';
import { api } from 'REST';
import { sortTasksByGroup } from 'instruments';

//Components
import Task from "components/Task";
import Catcher from "components/Catcher";
import Spinner from "components/Spinner";
import Checkbox from "theme/assets/Checkbox";


export default class Scheduler extends Component {

    state = {
        tasks:           [],
        isTasksFetching: false,
        newTaskMessage:  '',
        tasksFilter:     '',
        selectedTasks:   [],
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _fetchTasksAsync = async () => {
        try {
            this._setTasksFetchingState(true);
            const tasks = await api.fetchTasks();

            this.setState({
                tasks,
            });
        } catch ({ message: errorMessage }) {
            console.error(errorMessage);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _setTasksFetchingState = (isTasksFetching) => {
        this.setState({
            isTasksFetching,
        });
    };

    _createTaskAsync = async (e) => {
        e.preventDefault();
        const { newTaskMessage:message, tasks } = this.state;

        if (!message.trim()) {
            return null;
        }

        try {
            this._setTasksFetchingState(true);
            const newTask = await api.createTask(message);

            this._setTasksFetchingState(false);
            this.setState({
                newTaskMessage: '',
                tasks:          [newTask, ...tasks],
            });

        } catch ({ message: errorMessage }) {
            console.error(errorMessage);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _updateTaskAsync = async (items) => {
        try {
            this._setTasksFetchingState(true);

            const { tasks } = this.state;
            const updated = await api.updateTask(items);
            const result = tasks.map((task) => Object.assign(task, updated.find((item) => item.id === task.id)));

            this.setState({ tasks: result });
        } catch ({ message: errorMessage }) {
            console.error(errorMessage);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _removeTaskAsync = async (id) => {
        try {
            const { tasks } = this.state;

            this._setTasksFetchingState(true);
            await api.removeTask(id);
            this.setState({ tasks: tasks.filter((task) => task.id !== id) });
        } catch ({ message: errorMessage }) {
            console.error(errorMessage);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _updateNewTaskMessage = (e) => {
        const { value: newTaskMessage } = e.target;

        this.setState({ newTaskMessage });
    };

    _updateTasksFilter = (e) => {
        const filter = e.target.value.toLowerCase();

        this.setState({ tasksFilter: filter });
    };

    _completeAllTasksAsync = async () => {
        if (this._getAllCompleted()) {
            return null;
        }

        try {
            this._setTasksFetchingState(true);
            const { tasks } = this.state;
            const unCompleted = tasks.filter((task) => task.completed === false);

            await api.completeAllTasks(unCompleted);

            unCompleted.forEach((task) => task.completed = true);

            this.setState({ tasks });
        } catch ({ message: errorMessage }) {
            console.error(errorMessage);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _getAllCompleted = () => {
        const { tasks } = this.state;

        return tasks.every((task) => task.completed);
    };

    render () {
        const {
            tasks: userTasks,
            isTasksFetching,
            tasksFilter,
            newTaskMessage,
        } = this.state;

        const tasks = sortTasksByGroup(userTasks).map((task) => (
            <Task
                key = { task.id }
                { ...task }
                _removeTaskAsync = { this._removeTaskAsync }
                _updateTaskAsync = { this._updateTaskAsync }
            />
        ));

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isSpinning = { isTasksFetching } />
                    <header>
                        <h1 className = 'test'>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { tasksFilter }
                            onChange = { this._updateTasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync } >
                            <input
                                className = { Styles.createTask }
                                maxLength = { 50 }
                                placeholder = 'Описание моей новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <ul>
                            <FlipMove
                                className = 'flip-wrapper'
                                duration = { 400 }
                                enterAnimation = 'elevator'
                                leaveAnimation = 'elevator'
                                typeName = 'div'>
                                {tasks}
                            </FlipMove>
                        </ul>
                    </section>
                    <footer >
                        <Checkbox
                            checked = { false }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span className = 'completeAllTasks'>Все задачи выполнены</span>
                    </footer>
                </main>
            </section>

        );
    }
}
