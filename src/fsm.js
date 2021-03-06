class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.initialState = config.initial;
        this.activeState = config.initial;
        this.states = config.states;
        this.history = [config.initial];
        this.historyStage = 0;
        this.undoIsAvailable = false;
        this.redoIsAvailable = false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
         return this.activeState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(this.states[state]) {
            this.activeState = state;
            this.history.push(state);
            this.historyStage++;
            this.undoIsAvailable = true;
            this.redoIsAvailable = false;
        }      
        else throw new Error('state isn\'t exist');
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var transitions = this.states[this.activeState].transitions;
        if(event in transitions) {           
            this.changeState(transitions[event]);
        } else {
            throw new Error('event in current state isn\'t exist');
        } 
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.activeState = this.initialState;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var states = [];
        if(!arguments.length) {
            for(var key in this.states) {
                states.push(key);
            }
        } else {
            for(key in this.states) {
                if(event in this.states[key].transitions) {
                    states.push(key);
                }
            }
        } 
        return states;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this.history.length == 1) {
            this.undoIsAvailable = false;           
        } else if(!this.historyStage) {
            this.undoIsAvailable = false;
            this.redoIsAvailable = true;
        }
        if(this.undoIsAvailable) {
            this.activeState = this.history[--this.historyStage];
            this.redoIsAvailable = true;
        }
        return this.undoIsAvailable;
        
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this.history.length == 1 || this.historyStage == this.history.length-1) {
            this.redoIsAvailable = false;
        }  
        if(this.redoIsAvailable){
            this.activeState = this.history[++this.historyStage];
        }
        return this.redoIsAvailable;           
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [this.initialState];
        this.historyStage = 0;
        this.undoIsAvailable = false;
        this.redoIsAvailable = false;        
    }
}

module.exports = FSM;
