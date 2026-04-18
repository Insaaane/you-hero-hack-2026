import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from 'react'
import { skipToken } from '@reduxjs/toolkit/query'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { setCurrentRole } from '@/app/model/sessionSlice'
import { useGetTaskQuery } from '@/entities/inspection'
import { useAppDispatch } from '@/shared/lib/store'
import { useHasWindowScrolled } from '@/shared/lib/viewport'
import {
  getWorkerRouteTitle,
  inspectionRequestPath,
} from '../model/navigation'
import { WorkerNavigationDrawer } from './WorkerNavigationDrawer'
import { WorkerTopbar, type WorkerTopbarAction } from './WorkerTopbar'

export type WorkerOutletContext = {
  setTopbarAction: Dispatch<
    SetStateAction<WorkerTopbarAction | null | undefined>
  >
}

export function WorkerAppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [topbarAction, setTopbarAction] = useState<
    WorkerTopbarAction | null | undefined
  >()
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const hasScrolled = useHasWindowScrolled()
  const taskId = useMemo(
    () =>
      location.pathname.match(
        /^\/inspector\/rounds\/[^/]+\/tasks\/([^/]+)/,
      )?.[1],
    [location.pathname],
  )
  const { data: currentTask } = useGetTaskQuery(taskId ?? skipToken)
  const fallbackTitle = useMemo(
    () => getWorkerRouteTitle(location.pathname),
    [location.pathname],
  )
  const title = currentTask?.title ?? fallbackTitle
  const isInspectionRoundPage = /^\/inspector\/rounds\/[^/]+\/?$/.test(
    location.pathname,
  )
  const isInspectionRoundsListPage = location.pathname === '/inspector/rounds'
  const shouldShowPrimaryActions =
    isInspectionRoundsListPage || isInspectionRoundPage

  useEffect(() => {
    dispatch(setCurrentRole('inspector'))
  }, [dispatch])

  const handleBack = () => {
    const taskRoundId = location.pathname.match(
      /^\/inspector\/rounds\/([^/]+)\/tasks\//,
    )?.[1]

    if (taskRoundId) {
      navigate(`/inspector/rounds/${taskRoundId}`)
      return
    }

    if (location.pathname.includes('/rounds/')) {
      navigate('/inspector/rounds')
      return
    }

    navigate(inspectionRequestPath)
  }

  const handleOpenQrScanner = () => {
    navigate('/inspector/qr-scanner')
  }

  return (
    <div className="worker-shell">
      <WorkerTopbar
        title={title}
        hasScrolled={hasScrolled}
        rightAction={topbarAction}
        onBack={handleBack}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenQrScanner={handleOpenQrScanner}
        showMenuAction={shouldShowPrimaryActions}
        showQrScannerAction={shouldShowPrimaryActions}
      />

      <Outlet context={{ setTopbarAction } satisfies WorkerOutletContext} />

      <WorkerNavigationDrawer
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  )
}
