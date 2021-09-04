import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alternatives from '../components/Alternatives';
import Question from '../components/Question';
import { fetchQuestions as fetchQuestionsAction, setIndex } from '../redux/actions/index';

class GamePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      next: false,
      questionNumber: 0,
      seconds: 5,
    };

    this.toggleNextButton = this.toggleNextButton.bind(this);
    this.applyColor = this.applyColor.bind(this);
    this.showNextQuestion = this.showNextQuestion.bind(this);
    this.removeColor = this.removeColor.bind(this);
    this.changeIndex = this.changeIndex.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    const { fetchQuestions } = this.props;
    await fetchQuestions();

    this.updateSeconds();
  }

  componentDidUpdate() {
    const { seconds } = this.state;
    if (seconds === 0) {
      clearInterval(this.countDown);
    }
  }

  updateSeconds() {
    const ONE_SECOND = 1000;
    this.countDown = setInterval(() => {
      this.setState((prevState) => ({ seconds: prevState.seconds - 1 }));
    }, ONE_SECOND);
  }

  changeIndex() {
    const { index } = this.state;
    this.setState({ index: index + 1 });
  }

  handleClick() {
    const { getIndex, index, history } = this.props;
    const LIMIT = 4;
    if (index === LIMIT) {
      history.push('/feedback');
    } else {
      getIndex();
      this.setState({
        seconds: 5,
      });
      this.updateSeconds();
    }
  }

  applyColor() {
    const correct = document.querySelector('.correct');
    correct.className = 'correct correct-answer';

    const incorrect = document.querySelectorAll('.incorrect');
    incorrect.forEach((item) => {
      item.className = 'incorrect incorrect-answer';
      return item;
    });

    this.toggleNextButton();
  }

  removeColor() {
    const correct = document.querySelector('.correct');
    correct.className = 'correct default';

    const incorrect = document.querySelectorAll('.incorrect');
    incorrect.forEach((item) => {
      item.className = 'incorrect default';
      return item;
    });

    this.toggleNextButton();
  }

  toggleNextButton() {
    this.setState((previousValue) => ({
      next: !previousValue.next,
    }));
  }

  showNextQuestion() {
    this.removeColor();
    this.setState((prev) => ({
      questionNumber: prev.questionNumber + 1,
    }));
  }

  render() {
    const { next, questionNumber, seconds } = this.state;
    return (
      <div>
        <p>{ seconds }</p>
        <Question
          questionNumber={ questionNumber }
        />

        <Alternatives
          applyColor={ this.applyColor }
          questionNumber={ questionNumber }
          seconds={ seconds }
        />

        <div>
          { next && (
            <button
              type="button"
              onClick={ this.showNextQuestion }
              data-testid="btn-next"
              // onClick={ this.handleClick }
            >
              Proxima
            </button>) }
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchQuestions: () => dispatch(fetchQuestionsAction()),
  getIndex: () => dispatch(setIndex()),
});

const mapStateToProps = (state) => ({
  index: state.gamePage.index,
});

GamePage.propTypes = {
  fetchQuestions: PropTypes.func.isRequired,
  getIndex: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(GamePage);
