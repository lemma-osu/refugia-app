import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";

const items = [
  {
    header: "What are fire refugia?",
    body: (
      <p>
        Fire refugia are an important living legacy of wildfires and a key
        component of post-fire recovery, ecosystems services, and resilience and
        adaptation to future disturbance. We define fire refugia as locations on
        the landscape that burn less frequently or severely than their
        surroundings. There’s a lot of interesting and important variability
        with the concept of “fire refugia”, so feel free to{" "}
        <a
          href="http://firerefugia.forestry.oregonstate.edu/about"
          target="_blank"
          rel="noopener noreferrer"
        >
          dig in for more information
        </a>
        . The data we present here focuses on the context of fire refugia in
        forests of the Pacific Northwest of the United States, where
        conservation issues focus on{" "}
        <a
          href="http://firerefugia.forestry.oregonstate.edu/home"
          target="_blank"
          rel="noopener noreferrer"
        >
          maintenance of mature and old-growth forest
        </a>
        . We’re interested in patches of forest that persist through recent fire
        events as living legacies. These forests can be burned at low severity
        or be truly unburned, but the key characteristic is that most trees
        survive through the fire event and contribute as living trees to the
        post-fire landscape mosaic
      </p>
    ),
  },
  {
    header: "What is Eco-Vis?",
    body: (
      <p>
        This Eco-Vis web application and tool is designed to provide a platform
        for data access, dynamic mapping and exploration, visualization, and
        data download. The maps and models are developed by Oregon State
        University’s{" "}
        <a
          href="http://people.forestry.oregonstate.edu/meg-krawchuk/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Landscape Fire and Conservation Science Research Group
        </a>
        . Eco-Vis provides tools that facilitate understanding of the geography
        of biophysical data. In particular, our goal is to help users understand
        how data are incorporated into our predictive models developed for
        conservation-adaptation science and land management.{" "}
      </p>
    ),
  },
  {
    header: "Why Eco-Vis?",
    body: (
      <p>
        Advances in geoprocessing capacity have led to increased demand for and
        more widespread access to predictive ecological maps than ever before.
        An important motivation for building predictive ecological models, in
        addition to production of maps, is to understand the mechanistic drivers
        of the observed patterns. Comprehensive understanding of these models
        and effective application of predictive ecological maps to real-world
        problems requires tools for visualizing relationships between model
        predictions and their drivers. This is especially true when complex
        modeling frameworks, such as machine learning, are used. Currently, few
        tools exist to aid users of predictive ecological maps in this process
        of concurrent exploration of the spatial, geographic, and mechanistic
        relationships between prediction surfaces and their underlying drivers,
        resulting in a “black box” effect. This web portal was developed
        specifically to address this gap by linking predictive ecological maps,
        geographic biophysical data, and a toolset for exploring and visualizing
        the modeled relationships between map predictions and their underlying
        biophysical drivers.{" "}
      </p>
    ),
  },
  {
    header: "What is the Model Inspection Window (MIW)? ",
    body: (
      <>
        <p>
          Eco-Vis allows exploration and access to predictive maps, and it also
          features a unique visualization tool, the Model Inspection Window –MIW
          (say out loud then imagine a baby kitty). The MIW permits detailed
          exploration of the <em>probability maps</em>, underlying{" "}
          <em>driver/predictor</em> variable maps and{" "}
          <em>response functions</em> that describe how predicted probabilities
          are influenced by each predictor variable. Once activated, the MIW
          displays the probability map and a true color image of the selected
          area of interest, clipped maps of the predictor variables for the area
          of interest, and the response function curves for each predictor
          variable.{" "}
        </p>
        <ul>
          <li className="pb-3">
            <em>Probability maps:</em> The raster maps available on Eco-Vis
            consist of pixel-level predictions from boosted regression tree
            models that, together, describe the probability surface for each
            variable of interest. The predictions range from 0 (low probability)
            to 1 (high probability). These maps are useful for understanding
            large- or fine-scale patterns in the likelihood of a phenomenon,
            given any specific set of conditions. The models served up here are
            based on a suite of topographic, vegetation, fire behavior, fire
            weather, and climatic predictor variables from burned areas
            occurring in the Pacific Northwest during 2002-2017.{" "}
          </li>
          <li className="pb-3">
            <em>Drivers/predictors:</em> Model predictions are based on a suite
            of time-invariant (we mean they vary spatially, but not temporally)
            and time-varying (varying spatially and temporally) predictors. The
            time-invariant predictor surfaces, such as topography, are fixed and
            require no input from the user. However, time-varying predictors,
            such as fire weather or climate, can fluctuate and require user
            input to tune these dials to the levels desired for each map.
            Eco-Vis allows two influential time-varying predictors for any model
            to be set to low (10th percentile), moderate (50th percentile), or
            extreme (90th percentile) conditions, based on July-September data
            from 1986-2018. This showcase uses minimum relative humidity and
            maximum temperature as time-varying predictor "levers". This
            functionality permits the user to observe changes in the spatial
            patterns of predicted fire severity under a range of conditions, to
            examine why these changes occur based on the modeled relationships
            between each driver and the modeled probability, and to explore the
            spatial and geographic patterns of the underlying predictor
            variables side-by-side with the predictions.
          </li>
          <li className="pb-3">
            <em>Response functions:</em> Partial dependence (PD) plots show the
            effect of a given predictor variable on the modeled probability of
            the response variable, when all other predictors are held constant.
            Essentially, they show how each predictor variable influences the
            prediction probability. PD plots are useful for describing the shape
            of the relationship between the model predictions and each predictor
            and for identifying ranges of each predictor variable that result in
            high or low prediction probability. These plots aid in answering
            question such as: is the relationship between modeled probability
            and a predictor positive or negative or does it change across the
            range of predictor variable values? Do the predictions change
            gradually or abruptly with changes in a predictor variable? Are
            there multiple inflection points in the relationship or is it a more
            simple, linear response? Thus, PD plots are a great way to
            understand what is driving the model predictions overall or for
            specific areas of interest.
            <br />
            <br />
            PD plots display the range of predictor variable values on the
            x-axis and its marginal effect on the modeled probability on the
            y-axis. When examining PD plots, the absolute values of the y-axis
            are less important than the general upward (higher probability) or
            downward (lower probability) trend. You may ask, what is the
            marginal effect? – The marginal effect means that the value on the
            y-axis is calculated after integrating (or accounting for) the
            effect of all other variables in the model. Accordingly, the y-axis
            is a sort of relative effect, rather than absolute . The relative
            importance value listed with the PD plot for each predictor variable
            quantifies the magnitude of influence of each predictor variable on
            the model, providing a useful benchmark for interpreting key
            drivers.
          </li>
          <li className="pb-3">
            <em>Modeling ecoregions:</em> To permit model adaptability to
            different fire dynamics and biophysical conditions across our broad
            study region, we built separate models for each of our response
            variables (fire refugia, high severity) for two broad ecoregions.
            The non-fire-prone ecoregion encompasses the moist
            Douglas-fir/western hemlock forests of the northwestern portion of
            our study area. The fire-prone ecoregion encompasses forests with
            more fire-resistant species such as pines, larch, and oaks that
            characterize the eastern Cascades and southwest portion of our study
            region. All products are seamless composites derived from these
            joint models. You can see the boundary of the fire-prone and
            non-fire-prone ecoregions when you zoom out to broader extents of
            view. Ecoregional boundaries can be downloaded using the Data
            Download button.
          </li>
        </ul>
      </>
    ),
  },
  {
    header: "Let’s start looking at maps and models in the MIW!",
    body: (
      <p>
        Eco-Vis allows the user to select from a list of predictive fire
        severity maps (fire refugia or high severity fire), explore and download
        these maps, view the predictions side-by-side with the underlying
        geospatial data inputs, and examine the modeled relationships between
        the severity predictions and their drivers.
        <br />
        <br />
        Take a look at the How-to materials for more information on how to work
        with Eco-Vis and MIW.
      </p>
    ),
  },
  {
    header: "More Information",
    body: (
      <p>
        Additional context, literature on fire refugia, and documentation for
        this project can be found at:{" "}
        <a
          href="http://firerefugia.forestry.oregonstate.edu/home"
          target="_blank"
          rel="noopener noreferrer"
        >
          http://firerefugia.forestry.oregonstate.edu/home
        </a>
        . For questions and comments, please email: Dr. Meg A. Krawchuk,
        meg.krawchuk [at] oregonstate.edu for contact/help/information.
      </p>
    ),
  },
];

export default function IntroductionPanel({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>EcoVis Tool</Modal.Title>
      </Modal.Header>

      <Modal.Body>
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
