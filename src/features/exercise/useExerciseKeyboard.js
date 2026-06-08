import { onBeforeUnmount, onMounted } from 'vue'
import { isTypingTarget, optionIndexFromShortcut } from '@/features/exercise/exerciseSession'

// Wires global keyboard shortcuts for the single-question view.
// Behavior is identical to the original ExercisePage handler.
export function useExerciseKeyboard(session) {
  const {
    viewMode,
    questions,
    activeQuestion,
    previousIndex,
    nextIndex,
    isSelected,
    setOption,
    submitQuestion,
    toggleFavorite,
    goToIndex,
  } = session

  function handleKeydown(event) {
    if (viewMode.value !== 'single' || !questions.value.length || isTypingTarget(event.target)) return
    const question = activeQuestion.value
    if (!question) return

    if (event.key === 'ArrowLeft') {
      if (previousIndex.value == null) return
      event.preventDefault()
      goToIndex(previousIndex.value)
      return
    }

    if (event.key === 'ArrowRight') {
      if (nextIndex.value == null) return
      event.preventDefault()
      goToIndex(nextIndex.value)
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      submitQuestion(question)
      if (nextIndex.value != null) goToIndex(nextIndex.value)
      return
    }

    if (event.key.toLowerCase() === 'f') {
      event.preventDefault()
      toggleFavorite(question.id)
      return
    }

    const optionIndex = optionIndexFromShortcut(event.key)
    if (optionIndex == null || !question.options[optionIndex]) return
    event.preventDefault()
    setOption(question, optionIndex, question.type === 'multiple' ? !isSelected(question, optionIndex) : true)
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
}
