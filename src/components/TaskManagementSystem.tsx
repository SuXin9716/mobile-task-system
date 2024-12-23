<antArtifact identifier="task-system-component" type="application/vnd.ant.code">
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react'

const taskPackages = [
  {
    id: 'ple',
    title: 'PLE',
    description: '基础 PLE 配置任务',
    subtasks: [
      {
        id: 'ple-1',
        title: '配置基础环境',
        steps: [
          '打开系统设置',
          '进入环境配置面板',
          '设置PLE相关参数'
        ],
        completed: false
      },
      {
        id: 'ple-2',
        title: '验证PLE设置',
        steps: [
          '运行验证测试',
          '检查输出结果',
          '确认配置正确'
        ],
        completed: false
      }
    ]
  },
  {
    id: 'ple-opt',
    title: 'PLE with opt',
    description: 'PLE 优化配置任务',
    subtasks: [
      {
        id: 'opt-1',
        title: '优化设置',
        steps: [
          '配置优化参数',
          '调整性能选项',
          '保存设置'
        ],
        completed: false
      }
    ]
  },
  {
    id: 'mcmm',
    title: 'MCMM',
    description: 'MCMM 配置任务',
    subtasks: [
      {
        id: 'mcmm-1',
        title: 'MCMM配置',
        steps: [
          '设置MCMM参数',
          '配置相关选项'
        ],
        completed: false
      },
      {
        id: 'mcmm-2',
        title: 'MCMM验证',
        steps: [
          '运行验证流程',
          '检查结果'
        ],
        completed: false
      }
    ]
  }
]

export default function TaskManagementSystem() {
  const [mode, setMode] = useState('list')
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [currentSubtask, setCurrentSubtask] = useState(null)
  const [tasks, setTasks] = useState(taskPackages)

  const calculateProgress = (pkg) => {
    const total = pkg.subtasks.length
    const completed = pkg.subtasks.filter(t => t.completed).length
    return (completed / total) * 100
  }

  const completeSubtask = (packageId, subtaskId) => {
    setTasks(prevTasks => {
      return prevTasks.map(pkg => {
        if (pkg.id === packageId) {
          return {
            ...pkg,
            subtasks: pkg.subtasks.map(task => {
              if (task.id === subtaskId) {
                return { ...task, completed: !task.completed }
              }
              return task
            })
          }
        }
        return pkg
      })
    })

    if (mode === 'guided') {
      const pkg = tasks.find(p => p.id === packageId)
      const currentIndex = pkg.subtasks.findIndex(s => s.id === subtaskId)
      if (currentIndex < pkg.subtasks.length - 1) {
        setCurrentSubtask(pkg.subtasks[currentIndex + 1])
      } else {
        setSelectedPackage(null)
        setCurrentSubtask(null)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="flex items-center justify-between p-4">
          {selectedPackage ? (
            <button
              className="flex items-center text-blue-600"
              onClick={() => {
                setSelectedPackage(null)
                setCurrentSubtask(null)
              }}
            >
              <ArrowLeft className="h-6 w-6 mr-2" />
              返回
            </button>
          ) : (
            <h1 className="text-lg font-semibold">任务管理系统</h1>
          )}
          <button
            className="px-4 py-2 bg-white border rounded-lg"
            onClick={() => {
              setMode(mode === 'list' ? 'guided' : 'list')
              setSelectedPackage(null)
              setCurrentSubtask(null)
            }}
          >
            {mode === 'list' ? '引导模式' : '列表模式'}
          </button>
        </div>
      </div>

      <div className="mt-16 px-4">
        {!selectedPackage ? (
          <div className="space-y-4">
            {tasks.map(pkg => (
              <Card 
                key={pkg.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedPackage(pkg)
                  if (mode === 'guided') {
                    setCurrentSubtask(pkg.subtasks[0])
                  }
                }}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{pkg.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-3">{pkg.description}</p>
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${calculateProgress(pkg)}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      完成进度: {pkg.subtasks.filter(t => t.completed).length}/{pkg.subtasks.length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">{selectedPackage.title}</h2>
            
            {mode === 'guided' ? (
              currentSubtask && (
                <Card>
                  <CardHeader>
                    <div className="flex space-x-2 mb-4">
                      {selectedPackage.subtasks.map((subtask, index) => (
                        <div
                          key={subtask.id}
                          className={`h-2 flex-1 rounded-full ${
                            subtask.completed
                              ? 'bg-green-500'
                              : subtask.id === currentSubtask.id
                              ? 'bg-blue-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <CardTitle className="text-lg">{currentSubtask.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentSubtask.steps.map((step, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          {index + 1}. {step}
                        </p>
                      ))}
                      <button 
                        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                        onClick={() => completeSubtask(selectedPackage.id, currentSubtask.id)}
                      >
                        完成当前任务
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )
            ) : (
              <div className="space-y-3">
                {selectedPackage.subtasks.map(subtask => (
                  <Card key={subtask.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={subtask.completed}
                          onChange={() => completeSubtask(selectedPackage.id, subtask.id)}
                        />
                        <div>
                          <h3 className="font-medium">{subtask.title}</h3>
                          <div className="mt-2 space-y-1">
                            {subtask.steps.map((step, index) => (
                              <p key={index} className="text-sm text-gray-600">
                                {index + 1}. {step}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
  }
