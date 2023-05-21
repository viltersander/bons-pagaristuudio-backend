import React from "react"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"

type ExportModalProps = {
  handleClose: () => void
  onSubmit?: () => void
  loading: boolean
  title: string
}

const ExportModal: React.FC<ExportModalProps> = ({
  handleClose,
  title,
  loading,
  onSubmit,
}) => {
  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">{title}</span>
        </Modal.Header>
        <Modal.Content>
          {/* TODO: Add filtering
          <div className="flex inter-small-semibold mb-2">Current filters</div>
          <div className="flex mb-4 inter-small-regular text-grey-50">
            You havn’t applied any filtering. Remember that the export list
            feature in many ways are controlled by how you filter the list
            overview.
          </div> */}
          <div className="inter-small-regular text-grey-50 mb-4 flex">
            Käivitage oma andmete eksport
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-end">
            <Button
              variant="ghost"
              size="small"
              onClick={handleClose}
              className="mr-2"
            >
              Tühista
            </Button>
            <Button
              loading={loading}
              disabled={loading}
              variant="primary"
              size="small"
              onClick={onSubmit}
            >
              Ekspordi
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ExportModal
