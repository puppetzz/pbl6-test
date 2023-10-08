import { cn } from '@/lib/utils'
import { Mic, MicOff, Repeat } from 'lucide-react'
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition'

const SpeechRec = () => {
  const { transcript, listening, resetTranscript, isMicrophoneAvailable } =
    useSpeechRecognition()

  const handleMicClick = () => {
    if (!listening) {
      void SpeechRecognition.startListening({
        continuous: true,
        language: 'en-US'
      })
    } else {
      void SpeechRecognition.stopListening()
    }
  }

  return (
    <div className="flex aspect-[2/1] w-[60rem] flex-col items-center gap-5 rounded-xl bg-white px-10 py-20">
      <span className="w-full cursor-default select-none text-center text-[2rem] font-semibold">
        This summer I will visit a new country with two of my best friends.
      </span>
      <span className="text-center text-[2rem] font-semibold">
        {transcript}
      </span>
      {!listening && transcript ? (
        <div
          className="aspect-square cursor-pointer rounded-full bg-slate-200 p-4 hover:bg-slate-300"
          onClick={resetTranscript}
        >
          <Repeat />
        </div>
      ) : (
        <div
          className={cn(
            'flex aspect-square mt-auto w-[5rem] cursor-pointer items-center justify-center rounded-full bg-cyan-400 transition-colors',
            {
              'hover:bg-cyan-500': !listening,
              'bg-red-400 hover:bg-red-500': listening,
              'bg-gray-200': !isMicrophoneAvailable
            }
          )}
          onClick={handleMicClick}
        >
          {isMicrophoneAvailable ? (
            <Mic className="text-white" />
          ) : (
            <MicOff className="text-white" />
          )}
        </div>
      )}
    </div>
  )
}

export default SpeechRec
