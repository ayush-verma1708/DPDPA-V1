import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Progress,
  Table,
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Alert,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Scoreboard = () => {
  const [assets, setAssets] = useState([]);
  const [actions, setActions] = useState([]);
  const [filteredActions, setFilteredActions] = useState([]);
  const [scopes, setScopes] = useState([]);
  const [controlFamilies, setControlFamilies] = useState([]);
  const [statuses, setStatuses] = useState([]);
  // const [criticalIssues, setCriticalIssues] = useState([]);
  const [filters, setFilters] = useState({ asset: '', controlFamily: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState({
    asset: false,controlFamily: false, status: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchAssets(), 
          fetchActions(), 
          // fetchScopes(), 
          fetchControlFamilies(), 
          fetchStatuses(),
          // fetchCriticalIssues()
        ]);
      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await axios.get('http://localhost:8021/api/v1/assets');
      setAssets(response.data);
    } catch (err) {
      setError('Failed to fetch assets.');
    }
  };

  const fetchActions = async () => {
    try {
      const response = await axios.get('http://localhost:8021/api/v1/actions');
      setActions(response.data);
      setFilteredActions(response.data);
    } catch (err) {
      setError('Failed to fetch actions.');
    }
  };

  // const fetchScopes = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8021/api/v1/scoped');
  //     setScopes(response.data);
  //   } catch (err) {
  //     setError('Failed to fetch scopes.');
  //   }
  // };

  const fetchControlFamilies = async () => {
    try {
      const response = await axios.get('http://localhost:8021/api/v1/control-families');
      setControlFamilies(response.data);
    } catch (err) {
      setError('Failed to fetch control families.');
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await axios.get('http://localhost:8021/api/v1/completion-status');
      setStatuses(response.data);
    } catch (err) {
      setError('Failed to fetch statuses.');
    }
  };

  // const fetchCriticalIssues = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8021/api/v1/criticalIssues');
  //     setCriticalIssues(response.data);
  //   } catch (err) {
  //     setError('Failed to fetch critical issues.');
  //   }
  // };

  const handleFilterChange = (filter, value) => {
    const updatedFilters = { ...filters, [filter]: value };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const applyFilters = (filters) => {
    let updatedActions = actions;

    if (filters.asset) {
      updatedActions = updatedActions.filter(action => action.assetId === filters.asset);
    }
    // if (filters.scope) {
    //   updatedActions = updatedActions.filter(action => action.scopeId === filters.scope);
    // }
    if (filters.controlFamily) {
      updatedActions = updatedActions.filter(action => action.familyId === filters.controlFamily);
    }
    if (filters.status) {
      updatedActions = updatedActions.filter(action => action.status === filters.status);
    }

    setFilteredActions(updatedActions);
  };

  const calculateProgress = (actionsArray) => {
    if (!actionsArray.length) return 0;
    const completed = actionsArray.filter(action => action.isCompleted).length;
    return (completed / actionsArray.length) * 100;
  };

  const toggleDropdown = (dropdown) => setDropdownOpen(prevState => ({
    ...prevState,
    [dropdown]: !prevState[dropdown]
  }));

  const renderDropdown = (label, filterKey, items) => (
    <Dropdown isOpen={dropdownOpen[filterKey]} toggle={() => toggleDropdown(filterKey)}>
      <DropdownToggle caret>{label}</DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => handleFilterChange(filterKey, '')}>All {label}s</DropdownItem>
        {items.map(item => (
          <DropdownItem key={item._id} onClick={() => handleFilterChange(filterKey, item._id)}>
            {item.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );

  const getStatusBadgeColor = (isCompleted) => {
    return isCompleted ? 'success' : 'danger';
  };

  if (loading) return <Spinner color="primary" />;
  if (error) return <Alert color="danger">{error}</Alert>;

  return (
    <div>
      <h2>Scoreboard</h2>

      <Row className="overview mb-4">
        <Col md={4}>
          <Card>
            <CardBody>
              <CardTitle tag="h5">Total Assets</CardTitle>
              <div>{assets.length}</div>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <CardBody>
              <CardTitle tag="h5">Total Actions</CardTitle>
              <div>{actions.length}</div>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <CardBody>
              <CardTitle tag="h5">Completion Status</CardTitle>
              <Progress value={calculateProgress(filteredActions)} />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="filters mb-4">
        <Col md={3}>
          {renderDropdown('Asset', 'asset', assets)}
        </Col>
        {/* <Col md={3}>
          {renderDropdown('Scope', 'scope', scopes)}
        </Col> */}
        <Col md={3}>
          {renderDropdown('Control Family', 'controlFamily', controlFamilies)}
        </Col>
        <Col md={3}>
          {renderDropdown('Status', 'status', statuses)}
        </Col>
      </Row>

      <div className="progress-bars mb-4">
        <h4>Overall Progress</h4>
        <Progress value={calculateProgress(filteredActions)} />

        {assets.map(asset => (
          <div key={asset._id}>
            <h5>{asset.name}</h5>
            <Progress value={calculateProgress(filteredActions.filter(action => action.assetId === asset._id))} />
          </div>
        ))}
      </div>

      <Table striped responsive>
        <thead>
          <tr>
            <th>Action</th>
            <th>Control</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Completion Date</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {filteredActions.map(action => (
            <tr key={action._id}>
              <td>{action.actionName}</td>
              <td>{action.controlName}</td>
              <td>
                <Badge color={getStatusBadgeColor(action.isCompleted)}>{action.isCompleted ? 'true' : 'false'}</Badge>
              </td>
              <td>{action.username}</td>
              <td>{action.completedAt ? new Date(action.completedAt).toLocaleDateString() : 'N/A'}</td>
              <td>{action.feedback || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* <Row className="important-info mt-4">
        <Col>
          <Card>
            <CardBody>
              <CardTitle tag="h4">Alerts</CardTitle>
              {criticalIssues.length ? (
                <ul>
                  {criticalIssues.map(issue => (
                    <li key={issue._id}>
                      <strong>{issue.title}</strong>: {issue.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No critical issues to report.</div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row> */}

      <Row className="history mt-4">
        <Col>
          <Card>
            <CardBody>
              <CardTitle tag="h4">Recent Changes</CardTitle>
              {/* Add logic to display recent updates */}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Scoreboard;
