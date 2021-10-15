import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";

const items = [
  {
    header: "Main Navigation Page",
    body: (
      <p>
        The main page allows selection of the response variable and fire weather
        scenario of interest, dynamic navigation of the probability surface
        maps, and data download. To begin, you must first select a response
        surface (refugia or high severity), i.e. a probability map, of interest
        (note the color scale legend for the values displayed in the maps). Once
        a response surface is selected, the top fire weather predictor variables
        for that model are displayed and fire weather scenarios (low, moderate,
        or high extremity) can be selected. The low, moderate and high extremity
        scenarios correspond to the 10th, 50th, and 90th percentile values for
        each pixel during the 1986-2018 period of data availability, permitting
        evaluation of the model predictions over a broad range of conditions.
        The response surface for the selected fire weather scenario will then be
        displayed and is navigable in the main window. A swipe pane (blue button
        in center screen) permits toggling between the response surface map and
        a true color composite satellite image.
        <br />
        <br />
        Direct download of the probability maps for all fire weather scenarios
        are possible by clicking on the Download Data button.
        <br />
        <br />
        If further exploration of the data and the model predictions is desired,
        you’ll want to use the MIW. Before opening the MIW, the Model Inspector
        Window size must be selected from a pre-set list of three options on the
        main page. This window size sets the scale of the area displayed in the
        MIW. Navigate to the desired general location and place the MIW window
        (yellow rectangle) over the specific area of interest for viewing in the
        MIW. If the MIW window is not visible on your screen, press the
        “Recenter MIW Window” button. Then click on the green “To the MIW!!!” to
        launch the MIW. A status bar will appear while the prediction and
        predictor rasters for the area of interest are subset and the model
        response functions are loaded.
      </p>
    ),
  },
  {
    header: "Model Inspection Window (MIW)",
    body: (
      <p>
        The MIW has several important features. The upper left panel displays
        the region of interest for the selected response surface. In the upper
        right, the top fire weather predictor variables used to generate the
        extremity scenarios are listed. Dropdown menus associated with each
        predictor allow toggling between fire weather scenarios, which update
        the display in the upper left panel. Below each fire weather variable
        are the response function curves (see What is the Model Inspection
        Window (MIW?) in the Introduction for details), which depict how the
        prediction probability is influenced by each variable. The black dot on
        each graph shows where the selected fire weather scenario falls on each
        curve.
        <br />
        <br />
        The lower panel shows the raster surfaces and response function curves
        for all time-invariant predictor variables. Note that this is a sliding
        bar, where more than five predictors exist for a model. Predictors are
        listed from the most to the least important variables retained in each
        model. The percentage in parentheses, to the right of the predictor
        variable name, lists this relative importance value, which ranges from
        0-100%. Rasters for each predictor are subset to the same extent as the
        response surface raster. To aid with orientation, a yellow dot on each
        predictor raster is linked to the geographic location of the cursor on
        the predictor surface raster. The color scale bar above each predictor
        raster shows the range of displayed values. As for the fire weather
        predictors, the response function curves below each raster show how the
        prediction probability is influenced by each variable. The black dot on
        each graph shows the response function curve location of pixels moused
        over with the cursor on the response raster (and the yellow dot).
        Together, these features allow exploration of spatial model predictions
        as a function of the geographic variation of each variable and its
        influence on response surface probability.
      </p>
    ),
  },
];

export default function HowToPanel({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>How-To</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          This web portal consists of two pages, the main navigation page and
          the Model Inspection Window (MIW).
        </p>
        <Accordion defaultActiveKey="0" flush>
          {items.map((item, idx) => (
            <Accordion.Item key={idx} eventKey={`"${idx}"`}>
              <Accordion.Header>{item.header}</Accordion.Header>
              <Accordion.Body>{item.body}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
