import Button from "../../../components/fundamentals/button"
import SidedMouthFaceIcon from "../../../components/fundamentals/icons/sided-mouth-face"

function Placeholder({ showAddModal }) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <span className="text-grey-50">
        <SidedMouthFaceIcon width="48" height="48" />
      </span>

      <h3 className="text-large text-gray-90 mt-6 font-semibold">
      Alustage oma kanalite seadistamist...
      </h3>
      <p className="text-grey-50 mt-2 mb-8 w-[358px] text-center">
      Te pole sellesse kanalisse veel ühtegi toodet lisanud, kuid kui olete lisanud, hakkavad need siin olema.
      </p>

      <Button onClick={showAddModal} variant="primary" size="small">
        Lisa tooteid
      </Button>
    </div>
  )
}

export default Placeholder
