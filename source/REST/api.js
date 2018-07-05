import { MAIN_URL, TOKEN } from "./config";

export const api = {

    async fetchTasks () {
        const response = await fetch(MAIN_URL, {
            method:  "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
        });

        if (response.status !== 200) {
            throw new Error("Tasks were not loaded");
        }
        const { data: tasks } = await response.json();

        return tasks;
    },

    async createTask (message) {
        const response = await fetch(MAIN_URL, {
            method:  "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message }),
        });

        if (response.status !== 200) {
            const { errorMessage } = await response.json();

            throw new Error(`Task is not created. Error: ${errorMessage}`);
        }

        const { data: task } = await response.json();

        return task;
    },

    async updateTask (task) {
        const response = await fetch(MAIN_URL, {
            method:  "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
            body: JSON.stringify([task]),
        });

        if (response.status !== 200) {
            const { errorMessage } = await response.json();

            throw new Error(`Task were not created. Error: ${errorMessage}`);
        }

        const { data: result } = await response.json();

        return result;
    },

    async removeTask (id) {
        const response = await fetch(`${MAIN_URL}/${id}`, {
            method:  "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
        });

        if (response.status !== 204) {
            const { message } = await response.json();

            throw new Error(`Task were not deleted. Error: ${message}`);
        }
    },

    async completeAllTasks (tasks) {

        const requests = tasks.map(
            (task) => {
                task.completed = true;

                return fetch(`${MAIN_URL}`, {
                    method:  'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:  TOKEN,
                    },
                    body: JSON.stringify([task]),
                });
            }
        );

        await Promise.all(requests)
            .then((responses) => {
                responses.map((response) => {
                    if (response.status !== 200) {
                        throw new Error(`Task were not deleted.`);
                    }

                    return response.status;
                });
            })
            .catch(() => {
                throw new Error(`Task were not deleted.`);
            });
    },

};
