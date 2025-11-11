import { Cafe } from '@/types'

export async function shareCafe(cafes: Cafe[]) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Check out these amazing cafes!',
        text: `Discover great cafes in Moradabad with Caffind:\n\n${cafes.map(cafe => `- ${cafe.name}`).join('\n')}`,
      })
    } catch (err) {
      console.log('Sharing failed', err)
    }
  } else {
    // Fallback for browsers that don't support Web Share API
    alert('Web Share API not supported in your browser')
  }
}

export async function shareSingleCafe(cafe: Cafe) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: cafe.name,
        text: `${cafe.name} - ${cafe.description || 'A great cafe in Moradabad'}`,
        url: window.location.href,
      })
    } catch (err) {
      console.log('Sharing failed', err)
    }
  } else {
    // Copy to clipboard as fallback
    const text = `Check out ${cafe.name} in Moradabad!\n${cafe.address || ''}\n${cafe.description || ''}`
    try {
      await navigator.clipboard.writeText(text)
      alert('Cafe details copied to clipboard!')
    } catch (err) {
      console.log('Copying failed', err)
      prompt('Copy this cafe information:', text)
    }
  }
}