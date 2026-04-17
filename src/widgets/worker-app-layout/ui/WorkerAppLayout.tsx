import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { setCurrentRole } from '@/app/model/sessionSlice'
import { useAppDispatch } from '@/shared/lib/store'
import { useHasWindowScrolled } from '@/shared/lib/viewport'
import {
  getWorkerRouteTitle,
  inspectionRequestPath,
} from '../model/navigation'
import { WorkerNavigationDrawer } from './WorkerNavigationDrawer'
import { WorkerTopbar } from './WorkerTopbar'

export function WorkerAppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const hasScrolled = useHasWindowScrolled()
  const title = useMemo(
    () => getWorkerRouteTitle(location.pathname),
    [location.pathname],
  )

  useEffect(() => {
    dispatch(setCurrentRole('inspector'))
  }, [dispatch])

  const handleBack = () => {
    if (location.pathname.includes('/rounds/')) {
      navigate('/inspector/tasks')
      return
    }

    navigate(inspectionRequestPath)
  }

  const handleNavigate = (path: string) => {
    navigate(path)
    setIsMenuOpen(false)
  }

  return (
    <div className="worker-shell">
      <WorkerTopbar
        title={title}
        hasScrolled={hasScrolled}
        onBack={handleBack}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      <Outlet />

      <WorkerNavigationDrawer
        open={isMenuOpen}
        selectedPath={location.pathname}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  )
}
