import { IconButton, TableCell, Tooltip, Typography } from '@material-ui/core';
import { ButtonFilled, ButtonOutlined, Modal } from 'litmus-ui';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ButtonOutline from '../../../components/Button/ButtonOutline';
import { Cluster } from '../../../models/graphql/clusterData';
import { RootState } from '../../../redux/reducers';
import timeDifferenceForDate from '../../../utils/datesModifier';
import useStyles from './styles';

interface TableDataProps {
  data: Cluster;
  deleteRow: (clid: string) => void;
}

const TableData: React.FC<TableDataProps> = ({ data, deleteRow }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  // Function to convert UNIX time in format of DD MMM YYY
  const formatDate = (date: string) => {
    const updated = new Date(parseInt(date, 10) * 1000).toString();
    const resDate = moment(updated).format('DD MMM YYYY');
    if (date) return resDate;
    return 'Date not available';
  };

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };
  const userRole = useSelector((state: RootState) => state.userData.userRole);

  const handleClose = () => {
    deleteRow(data.cluster_id);
    setOpen(false);
  };

  return (
    <>
      <TableCell className={classes.tableDataStatus}>
        {data.is_cluster_confirmed === false ? (
          <Typography className={`${classes.check} ${classes.pending}`}>
            {t('workflowCluster.header.formControl.menu6')}
          </Typography>
        ) : data.is_cluster_confirmed === true && data.is_active ? (
          <Typography className={`${classes.check} ${classes.active}`}>
            {t('workflowCluster.header.formControl.menu1')}
          </Typography>
        ) : (
          <Typography className={`${classes.check} ${classes.notactive}`}>
            {t('workflowCluster.header.formControl.menu2')}
          </Typography>
        )}
      </TableCell>
      <TableCell className={classes.workflowNameData}>
        <Typography>{data.cluster_name}</Typography>
      </TableCell>
      <TableCell className={classes.stepsDataTime}>
        {formatDate(data.updated_at)}
      </TableCell>
      <TableCell>
        <Typography className={classes.stepsData}>
          {data.no_of_workflows}
        </Typography>
      </TableCell>
      <TableCell className={classes.stepsDataschedule}>
        <Typography>{data.no_of_schedules}</Typography>
      </TableCell>
      <TableCell className={classes.stepsData}>
        {data.last_workflow_timestamp === '0' ? (
          <Typography>Not Yet</Typography>
        ) : (
          timeDifferenceForDate(data.last_workflow_timestamp)
        )}
      </TableCell>
      <TableCell>
        <Tooltip
          classes={{
            tooltip: classes.customTooltip,
          }}
          disableFocusListener
          disableHoverListener={userRole !== 'Viewer'}
          placement="bottom"
          title="Insufficient Permissions"
        >
          <div className={classes.deleteCluster}>
            <div className={classes.targetsIcon}>
              <IconButton
                disabled={userRole === 'Viewer'}
                onClick={handleClick}
              >
                <img alt="delete" src="./icons/ClusterDisconnect.svg" />
              </IconButton>
            </div>
            <div>
              <Typography>{t('targets.modalDelete.disconnect')}</Typography>
            </div>
          </div>
        </Tooltip>
        <div>
          {open && (
            <div>
              <Modal
                open={open}
                onClose={() => {
                  setOpen(false);
                }}
                width="60%"
                modalActions={
                  <ButtonOutlined
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    &#x2715;
                  </ButtonOutlined>
                }
              >
                <div className={classes.body}>
                  <img src="/icons/DisconnectIcon.svg" alt="disconnect" />
                  <div className={classes.text}>
                    <Typography className={classes.typo} align="center">
                      {t('targets.modalDelete.head1')} <br />
                      {t('targets.modalDelete.head2')}
                      <br />
                      <strong>
                        {data.cluster_name} {t('targets.modalDelete.head4')}
                      </strong>
                    </Typography>
                  </div>
                  <div className={classes.textSecond}>
                    <Typography
                      className={classes.disconnectForever}
                      align="center"
                    >
                      {t('targets.modalDelete.head3')}
                    </Typography>
                  </div>
                  <div className={classes.buttonGroup}>
                    <ButtonOutline
                      isDisabled={false}
                      handleClick={() => {
                        setOpen(false);
                      }}
                    >
                      <> {t('targets.modalDelete.no')}</>
                    </ButtonOutline>

                    <ButtonFilled
                      disabled={userRole === 'Viewer'}
                      variant="error"
                      onClick={handleClose}
                      className={classes.w7}
                    >
                      <>{t('targets.modalDelete.yes')}</>
                    </ButtonFilled>
                  </div>
                </div>
              </Modal>
            </div>
          )}
        </div>
      </TableCell>
    </>
  );
};
export default TableData;
