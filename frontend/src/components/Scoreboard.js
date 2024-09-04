import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  const [filters, setFilters] = useState({ asset: '', scope: '', controlFamily: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState({
    asset: false, scope: false, controlFamily: false, status: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallel API calls
        const [assetsData, actionsData, scopesData, controlFamiliesData, statusesData] = await Promise.all([
          fetchAssets(),
          fetchActions(),
          fetchScopes(),
          fetchControlFamilies(),
          fetchStatuses(),
        ]);
        setAssets(assetsData);
        setActions(actionsData);
        setFilteredActions(actionsData);  // Initialize filtered actions
        setScopes(scopesData);
        setControlFamilies(controlFamiliesData);
        setStatuses(statusesData);
      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchAssets = async () => {
    const response = await axios.get('http://localhost:8021/api/v1/assets');
    return response.data;
  };

  const fetchActions = async () => {
    const response = await axios.get('http://localhost:8021/api/v1/actions');
    return response.data;
  };

  const fetchScopes = async () => {
    const response = await axios.get('http://localhost:8021/api/v1/scoped');
    return response.data;
  };

  const fetchControlFamilies = async () => {
    const response = await axios.get('http://localhost:8021/api/v1/control-families');
    return response.data;
  };

  const fetchStatuses = async () => {
    const response = await axios.get('http://localhost:8021/api/v1/completion-status');
    return response.data;
  };

  const handleFilterChange = (filter, value) => {
    const updatedFilters = { ...filters, [filter]: value };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  // Memoize filtered actions to avoid unnecessary re-renders
  const applyFilters = useCallback((filters) => {
    setFilteredActions(actions.filter(action => {
      return (!filters.asset || action.assetId === filters.asset) &&
             (!filters.scope || action.scopeId === filters.scope) &&
             (!filters.controlFamily || action.familyId === filters.controlFamily) &&
             (!filters.status || action.status === filters.status);
    }));
  }, [actions]);

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
        <Col md={3}>
          {renderDropdown('Scope', 'scope', scopes)}
        </Col>
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
                <Badge color={getStatusBadgeColor(action.isCompleted)}>{action.isCompleted ? 'Completed' : 'Incomplete'}</Badge>
              </td>
              <td>{action.username}</td>
              <td>{action.completedAt ? new Date(action.completedAt).toLocaleDateString() : 'N/A'}</td>
              <td>{action.feedback || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Uncomment and modify if you want to include critical issues */}
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
